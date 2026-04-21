import * as THREE from 'three'

import {
  BackgroundViewport,
  NetworkClusterDefinition,
  NetworkEdge,
  NetworkLayerDefinition,
  NetworkNodeSeed,
} from './viewport-background.models'

interface FlattenedLayerGeometry {
  linePositionsByTier: Float32Array[]
  pointPositionsByTier: Float32Array[]
  pulsePositions: Float32Array
  pulsePhases: Float32Array
  pulseRates: Float32Array
  pulseWeights: Float32Array
}

interface AnimatedNodeState {
  id: number
  baseX: number
  baseY: number
  angle: number
  radiusRatio: number
  radialX: number
  radialY: number
  tangentX: number
  tangentY: number
  phaseA: number
  phaseB: number
  phaseC: number
  amplitudeBias: number
  stretchBias: number
  shearBias: number
  orbitBias: number
  detailBias: number
}

interface PulseNodeBinding {
  clusterIndex: number
  nodeIndex: number
  phase: number
  rate: number
  weight: number
}

interface ClusterRuntimeState {
  restCenterX: number
  restCenterY: number
  viewportDriftX: number
  viewportDriftY: number
  opacityTier: number
  tierPointOffset: number
  tierLineOffset: number
  nodes: AnimatedNodeState[]
  edges: NetworkEdge[]
  worldPositions: Float32Array
  radius: number
  phaseA: number
  phaseB: number
  phaseC: number
  phaseD: number
  phaseE: number
  phaseF: number
  asymmetryX: number
  asymmetryY: number
}

const OPACITY_TIER_COUNT = 3
const LINE_OPACITY_TIERS = [0.62, 0.88, 0.9]
const POINT_OPACITY_TIERS = [0.64, 0.89, 0.92]
const POINT_SIZE_TIERS = [0.93, 0.99, 1.01]

export class PolygonNetworkLayer {
  private readonly group = new THREE.Group()
  private readonly clusters: ClusterRuntimeState[]
  private readonly pulseBindings: PulseNodeBinding[]
  private readonly lineGeometries: THREE.BufferGeometry[]
  private readonly pointGeometries: THREE.BufferGeometry[]
  private readonly pulseGeometry: THREE.BufferGeometry
  private readonly linePositionAttributes: THREE.BufferAttribute[]
  private readonly pointPositionAttributes: THREE.BufferAttribute[]
  private readonly pulsePositionAttribute: THREE.BufferAttribute
  private readonly pulseMaterial: THREE.ShaderMaterial
  private readonly linePositionsByTier: Float32Array[]
  private readonly pointPositionsByTier: Float32Array[]
  private readonly pulsePositions: Float32Array

  constructor(
    private readonly definition: NetworkLayerDefinition,
    private readonly viewport: BackgroundViewport,
  ) {
    const geometry = this.buildGeometry()
    this.clusters = geometry.clusters
    this.pulseBindings = geometry.pulseBindings
    this.linePositionsByTier = geometry.linePositionsByTier
    this.pointPositionsByTier = geometry.pointPositionsByTier
    this.pulsePositions = geometry.pulsePositions
    this.lineGeometries = this.linePositionsByTier.map(
      (positions) => new THREE.BufferGeometry().setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
      ),
    )
    this.pointGeometries = this.pointPositionsByTier.map(
      (positions) => new THREE.BufferGeometry().setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
      ),
    )
    this.pulseGeometry = new THREE.BufferGeometry()
    this.linePositionAttributes = this.lineGeometries.map((geometryEntry) =>
      geometryEntry.getAttribute('position') as THREE.BufferAttribute,
    )
    this.pointPositionAttributes = this.pointGeometries.map((geometryEntry) =>
      geometryEntry.getAttribute('position') as THREE.BufferAttribute,
    )
    this.pulsePositionAttribute = new THREE.BufferAttribute(this.pulsePositions, 3)
    this.pulseMaterial = this.createPulseMaterial()
    this.pulseGeometry.setAttribute('position', this.pulsePositionAttribute)
    this.pulseGeometry.setAttribute(
      'pulsePhase',
      new THREE.BufferAttribute(geometry.pulsePhases, 1),
    )
    this.pulseGeometry.setAttribute(
      'pulseRate',
      new THREE.BufferAttribute(geometry.pulseRates, 1),
    )
    this.pulseGeometry.setAttribute(
      'pulseWeight',
      new THREE.BufferAttribute(geometry.pulseWeights, 1),
    )

    this.linePositionAttributes.forEach((attribute) => {
      attribute.setUsage(THREE.DynamicDrawUsage)
    })
    this.pointPositionAttributes.forEach((attribute) => {
      attribute.setUsage(THREE.DynamicDrawUsage)
    })
    this.pulsePositionAttribute.setUsage(THREE.DynamicDrawUsage)

    this.group.position.z = this.definition.zOffset
    this.group.renderOrder = this.definition.renderOrder
    for (let tier = 0; tier < OPACITY_TIER_COUNT; tier += 1) {
      this.group.add(this.createLines(tier))
      this.group.add(this.createPoints(tier))
    }
    this.group.add(this.createPulsePoints())
    this.syncGeometry()
  }

  get object3D(): THREE.Object3D {
    return this.group
  }

  update(_: number, nowMs: number): void {
    this.writeAnimatedPositions(nowMs)
    this.linePositionAttributes.forEach((attribute) => {
      attribute.needsUpdate = true
    })
    this.pointPositionAttributes.forEach((attribute) => {
      attribute.needsUpdate = true
    })
    this.pulsePositionAttribute.needsUpdate = true
    this.pulseMaterial.uniforms['uTime'].value = nowMs * 0.001
  }

  dispose(): void {
    this.lineGeometries.forEach((geometryEntry) => {
      geometryEntry.dispose()
    })
    this.pointGeometries.forEach((geometryEntry) => {
      geometryEntry.dispose()
    })
    this.pulseGeometry.dispose()
    this.pulseMaterial.dispose()

    this.group.traverse((child) => {
      const mesh = child as THREE.LineSegments | THREE.Points

      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => material.dispose())
        return
      }

      if (mesh.material !== this.pulseMaterial) {
        mesh.material?.dispose()
      }
    })
  }

  private buildGeometry(): FlattenedLayerGeometry & {
    clusters: ClusterRuntimeState[]
    pulseBindings: PulseNodeBinding[]
  } {
    const totalPointsByTier = new Array<number>(OPACITY_TIER_COUNT).fill(0)
    const totalLineSegmentsByTier = new Array<number>(OPACITY_TIER_COUNT).fill(0)
    const clusters: ClusterRuntimeState[] = []
    const pulseBindings: PulseNodeBinding[] = []

    for (const cluster of this.definition.clusters) {
      const nodes = createRelaxedClusterNodes(cluster)
      const edges = createStableClusterEdges(
        nodes,
        cluster.radius * this.definition.edgeDistanceFactor,
        this.definition.maxNeighborsPerNode,
        cluster.seed,
      )
      const center = projectAnchor(cluster, this.viewport)
      const random = createSeededRandom(cluster.seed ^ 0x9e3779b9)
      const clusterIndex = clusters.length
      const opacityTier = pickOpacityTier(random)
      const tierPointOffset = totalPointsByTier[opacityTier] * 3
      const tierLineOffset = totalLineSegmentsByTier[opacityTier] * 6
      const runtimeNodes = nodes.map((node) => {
        const basis = normalized(node.x, node.y)

        return {
          id: node.id,
          baseX: node.x,
          baseY: node.y,
          angle: Math.atan2(node.y, node.x),
          radiusRatio: clamp(
            Math.hypot(node.x, node.y) / Math.max(cluster.radius * cluster.aspect, 1),
            0.18,
            1,
          ),
          radialX: basis.x,
          radialY: basis.y,
          tangentX: -basis.y,
          tangentY: basis.x,
          phaseA: random() * Math.PI * 2,
          phaseB: random() * Math.PI * 2,
          phaseC: random() * Math.PI * 2,
          amplitudeBias: 0.72 + random() * 0.56,
          stretchBias: 0.7 + random() * 0.6,
          shearBias: 0.65 + random() * 0.7,
          orbitBias: 0.7 + random() * 0.6,
          detailBias: 0.55 + random() * 0.9,
        }
      })

      totalPointsByTier[opacityTier] += runtimeNodes.length
      totalLineSegmentsByTier[opacityTier] += edges.length

      clusters.push({
        restCenterX: center.x,
        restCenterY: center.y,
        viewportDriftX: (random() < 0.5 ? -1 : 1) * (0.7 + random() * 0.6),
        viewportDriftY: (random() < 0.5 ? -1 : 1) * (0.7 + random() * 0.6),
        opacityTier,
        tierPointOffset,
        tierLineOffset,
        nodes: runtimeNodes,
        edges,
        worldPositions: new Float32Array(runtimeNodes.length * 2),
        radius: cluster.radius,
        phaseA: random() * Math.PI * 2,
        phaseB: random() * Math.PI * 2,
        phaseC: random() * Math.PI * 2,
        phaseD: random() * Math.PI * 2,
        phaseE: random() * Math.PI * 2,
        phaseF: random() * Math.PI * 2,
        asymmetryX: random() * 2 - 1,
        asymmetryY: random() * 2 - 1,
      })

      const pulseNodeIndices = selectPulseNodeIndices(
        nodes,
        edges,
        cluster.seed,
        this.definition.pulseNodeCount,
      )

      for (const nodeIndex of pulseNodeIndices) {
        pulseBindings.push({
          clusterIndex,
          nodeIndex,
          phase: random() * Math.PI * 2,
          rate: 0.72 + random() * 1.12,
          weight: 0.86 + random() * 0.18,
        })
      }
    }

    const pointPositionsByTier = totalPointsByTier.map(
      (count) => new Float32Array(count * 3),
    )
    const linePositionsByTier = totalLineSegmentsByTier.map(
      (count) => new Float32Array(count * 6),
    )
    const pulsePositions = new Float32Array(pulseBindings.length * 3)
    const pulsePhases = new Float32Array(pulseBindings.length)
    const pulseRates = new Float32Array(pulseBindings.length)
    const pulseWeights = new Float32Array(pulseBindings.length)

    for (let index = 0; index < pulseBindings.length; index += 1) {
      pulsePhases[index] = pulseBindings[index].phase
      pulseRates[index] = pulseBindings[index].rate
      pulseWeights[index] = pulseBindings[index].weight
    }

    return {
      clusters,
      pulseBindings,
      linePositionsByTier,
      pointPositionsByTier,
      pulsePositions,
      pulsePhases,
      pulseRates,
      pulseWeights,
    }
  }

  private createLines(tier: number): THREE.LineSegments {
    const material = new THREE.LineBasicMaterial({
      color: this.definition.lineColor,
      transparent: true,
      opacity: this.definition.lineOpacity * LINE_OPACITY_TIERS[tier],
      depthWrite: false,
      blending: THREE.NormalBlending,
    })

    const lines = new THREE.LineSegments(this.lineGeometries[tier], material)
    lines.renderOrder = this.definition.renderOrder + tier * 0.01
    lines.frustumCulled = false
    return lines
  }

  private createPoints(tier: number): THREE.Points {
    const material = new THREE.PointsMaterial({
      color: this.definition.pointColor,
      size: this.definition.pointSize * POINT_SIZE_TIERS[tier],
      sizeAttenuation: false,
      transparent: true,
      opacity: this.definition.pointOpacity * POINT_OPACITY_TIERS[tier],
      depthWrite: false,
    })

    const points = new THREE.Points(this.pointGeometries[tier], material)
    points.renderOrder = this.definition.renderOrder + tier * 0.01
    points.frustumCulled = false
    return points
  }

  private createPulsePoints(): THREE.Points {
    const points = new THREE.Points(this.pulseGeometry, this.pulseMaterial)
    points.renderOrder = this.definition.renderOrder + 1
    points.frustumCulled = false
    return points
  }

  private createPulseMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(this.definition.pointColor) },
        uBaseSize: {
          value: this.definition.pointSize * this.definition.pulseSizeScale,
        },
        uBaseOpacity: { value: this.definition.pulseOpacity },
        uPulseSpeed: { value: this.definition.pulseSpeed },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uBaseSize;
        uniform float uPulseSpeed;
        attribute float pulsePhase;
        attribute float pulseRate;
        attribute float pulseWeight;
        varying float vPulse;

        void main() {
          float primary = sin(uTime * uPulseSpeed * pulseRate + pulsePhase);
          float secondary = sin(
            uTime * uPulseSpeed * (pulseRate * 0.57 + 0.19) + pulsePhase * 1.63
          );
          float pulse = 0.5 + 0.5 * (primary * 0.68 + secondary * 0.32);
          vPulse = 0.74 + pulse * 0.42 * pulseWeight;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uBaseSize * (1.0 + pulse * 0.52 * pulseWeight);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uBaseOpacity;
        varying float vPulse;

        void main() {
          vec2 centered = gl_PointCoord - vec2(0.5);
          float dist = length(centered);
          float alpha = 1.0 - smoothstep(0.34, 0.5, dist);

          if (alpha <= 0.0) {
            discard;
          }

          gl_FragColor = vec4(uColor, alpha * uBaseOpacity * vPulse);
        }
      `,
    })
  }

  private syncGeometry(): void {
    this.writeAnimatedPositions(0)
    this.lineGeometries.forEach((geometryEntry) => {
      geometryEntry.computeBoundingSphere()
    })
    this.pointGeometries.forEach((geometryEntry) => {
      geometryEntry.computeBoundingSphere()
    })
    this.pulseGeometry.computeBoundingSphere()
  }

  private writeAnimatedPositions(nowMs: number): void {
    for (const cluster of this.clusters) {
      const pointPositions = this.pointPositionsByTier[cluster.opacityTier]
      const linePositions = this.linePositionsByTier[cluster.opacityTier]
      let pointCursor = cluster.tierPointOffset
      let lineCursor = cluster.tierLineOffset
      const clusterTransform = this.readClusterTransform(cluster, nowMs)
      const cos = Math.cos(clusterTransform.rotation)
      const sin = Math.sin(clusterTransform.rotation)

      for (let index = 0; index < cluster.nodes.length; index += 1) {
        const node = cluster.nodes[index]
        const offset = this.readNodeOffset(cluster, node, nowMs)
        const localX = (node.baseX + offset.x) * clusterTransform.scaleX
        const localY = (node.baseY + offset.y) * clusterTransform.scaleY
        const worldX = clusterTransform.centerX + localX * cos - localY * sin
        const worldY = clusterTransform.centerY + localX * sin + localY * cos
        const worldCursor = index * 2

        cluster.worldPositions[worldCursor] = worldX
        cluster.worldPositions[worldCursor + 1] = worldY

        pointPositions[pointCursor] = worldX
        pointPositions[pointCursor + 1] = worldY
        pointPositions[pointCursor + 2] = 0
        pointCursor += 3
      }

      for (const edge of cluster.edges) {
        const startCursor = edge.a * 2
        const endCursor = edge.b * 2

        linePositions[lineCursor] = cluster.worldPositions[startCursor]
        linePositions[lineCursor + 1] = cluster.worldPositions[startCursor + 1]
        linePositions[lineCursor + 2] = 0
        linePositions[lineCursor + 3] = cluster.worldPositions[endCursor]
        linePositions[lineCursor + 4] = cluster.worldPositions[endCursor + 1]
        linePositions[lineCursor + 5] = 0
        lineCursor += 6
      }
    }

    for (let index = 0; index < this.pulseBindings.length; index += 1) {
      const binding = this.pulseBindings[index]
      const cluster = this.clusters[binding.clusterIndex]
      const nodeCursor = binding.nodeIndex * 2
      const pulseCursor = index * 3

      this.pulsePositions[pulseCursor] = cluster.worldPositions[nodeCursor]
      this.pulsePositions[pulseCursor + 1] = cluster.worldPositions[nodeCursor + 1]
      this.pulsePositions[pulseCursor + 2] = 0
    }
  }

  private readClusterTransform(
    cluster: ClusterRuntimeState,
    nowMs: number,
  ): {
    centerX: number
    centerY: number
    scaleX: number
    scaleY: number
    rotation: number
  } {
    const time = nowMs * 0.001
    const driftTime = time * this.definition.motion.driftSpeed
    const morphTime = time * this.definition.motion.morphSpeed
    const sweepTime = time * this.definition.motion.sweepSpeed
    const driftAmplitude = cluster.radius * this.definition.motion.clusterOffsetRange
    const travelX = this.viewport.width * this.definition.motion.viewportDriftRange
    const travelY = this.viewport.height * this.definition.motion.viewportDriftRange * 0.92
    const fieldX = (
      Math.sin(driftTime * 0.19 + cluster.phaseA) * 0.42
      + Math.sin(driftTime * 0.11 + cluster.phaseC) * 0.33
      + Math.cos(driftTime * 0.07 + cluster.phaseE) * 0.25
    )
    const fieldY = (
      Math.cos(driftTime * 0.17 + cluster.phaseB) * 0.38
      + Math.sin(driftTime * 0.09 + cluster.phaseD) * 0.34
      + Math.cos(driftTime * 0.05 + cluster.phaseF) * 0.28
    )
    const viewportDriftAmplitude = this.viewport.minDimension
      * this.definition.motion.viewportDriftRange
    const viewportDriftX = viewportDriftAmplitude * (
      Math.sin(driftTime * 0.21 + cluster.phaseA) * 0.64
      + Math.cos(driftTime * 0.11 + cluster.phaseD) * 0.36
    ) * cluster.viewportDriftX
    const viewportDriftY = viewportDriftAmplitude * (
      Math.cos(driftTime * 0.17 + cluster.phaseB) * 0.58
      + Math.sin(driftTime * 0.09 + cluster.phaseE) * 0.42
    ) * cluster.viewportDriftY
    const fieldX0 = (
      Math.sin(cluster.phaseA) * 0.42
      + Math.sin(cluster.phaseC) * 0.33
      + Math.cos(cluster.phaseE) * 0.25
    )
    const fieldY0 = (
      Math.cos(cluster.phaseB) * 0.38
      + Math.sin(cluster.phaseD) * 0.34
      + Math.cos(cluster.phaseF) * 0.28
    )
    const viewportDriftX0 = (
      Math.sin(cluster.phaseA) * 0.64
      + Math.cos(cluster.phaseD) * 0.36
    ) * cluster.viewportDriftX
    const viewportDriftY0 = (
      Math.cos(cluster.phaseB) * 0.58
      + Math.sin(cluster.phaseE) * 0.42
    ) * cluster.viewportDriftY
    const localDriftX0 = Math.sin(cluster.phaseA) * 0.62
      + Math.sin(cluster.phaseB) * 0.38
    const localDriftY0 = Math.cos(cluster.phaseC) * 0.56
      + Math.sin(cluster.phaseD) * 0.44
    const centerX = cluster.restCenterX
      + travelX * (fieldX - fieldX0) * cluster.viewportDriftX
      + viewportDriftAmplitude * ((
        Math.sin(driftTime * 0.21 + cluster.phaseA) * 0.64
        + Math.cos(driftTime * 0.11 + cluster.phaseD) * 0.36
      ) * cluster.viewportDriftX - viewportDriftX0)
      + driftAmplitude * (
        Math.sin(driftTime + cluster.phaseA) * 0.62
        + Math.sin(driftTime * 0.43 + cluster.phaseB) * 0.38
        - localDriftX0
      )
    const centerY = cluster.restCenterY
      + travelY * (fieldY - fieldY0) * cluster.viewportDriftY
      + viewportDriftAmplitude * ((
        Math.cos(driftTime * 0.17 + cluster.phaseB) * 0.58
        + Math.sin(driftTime * 0.09 + cluster.phaseE) * 0.42
      ) * cluster.viewportDriftY - viewportDriftY0)
      + driftAmplitude * (
        Math.cos(driftTime * 0.88 + cluster.phaseC) * 0.56
        + Math.sin(driftTime * 0.37 + cluster.phaseD) * 0.44
        - localDriftY0
      )
    const scaleBase = 1 + this.definition.motion.scaleRange * (
      Math.sin(morphTime * 0.92 + cluster.phaseC) * 0.58
      + Math.sin(morphTime * 0.41 + cluster.phaseD) * 0.42
    )
    const scaleSpread = this.definition.motion.scaleRange * 0.34
      * Math.sin(morphTime * 0.61 + cluster.phaseE)
    const scaleX = scaleBase + scaleSpread
    const scaleY = scaleBase - scaleSpread * 0.88
    const rotation = this.definition.motion.rotationRange * (
      Math.sin(sweepTime * 0.64 + cluster.phaseE) * 0.58
      + Math.sin(sweepTime * 0.29 + cluster.phaseF) * 0.42
    )

    const containedCenterX = softContain(
      centerX,
      this.viewport.width * 0.39,
      this.viewport.width * 0.52 + cluster.radius * 0.36,
    )
    const containedCenterY = softContain(
      centerY,
      this.viewport.height * 0.37,
      this.viewport.height * 0.5 + cluster.radius * 0.34,
    )

    return {
      centerX: containedCenterX,
      centerY: containedCenterY,
      scaleX,
      scaleY,
      rotation,
    }
  }

  private readNodeOffset(
    cluster: ClusterRuntimeState,
    node: AnimatedNodeState,
    nowMs: number,
  ): { x: number; y: number } {
    const time = nowMs * 0.001
    const deformationTime = time * this.definition.motion.deformationSpeed
    const spatialX = node.baseX / Math.max(cluster.radius, 1)
    const spatialY = node.baseY / Math.max(cluster.radius, 1)
    const biasedX = spatialX + cluster.asymmetryX * 0.32
    const biasedY = spatialY + cluster.asymmetryY * 0.32
    const amplitude = cluster.radius
      * this.definition.motion.nodeOffsetRange
      * (0.34 + node.radiusRatio * 0.84)
      * node.amplitudeBias
    const stretchX = Math.sin(deformationTime * 0.86 + cluster.phaseA)
    const stretchY = Math.cos(deformationTime * 0.64 + cluster.phaseB)
    const shear = Math.sin(deformationTime * 0.52 + cluster.phaseC)
    const bend = Math.cos(deformationTime * 0.41 + cluster.phaseD)
    const orbitBand = Math.sin(
      deformationTime * 0.94 + node.angle * 1.62 + cluster.phaseE,
    )
    const crossBand = Math.cos(
      deformationTime * 0.72 + (spatialX - spatialY) * 1.94 + cluster.phaseF,
    )
    const localDetail = Math.sin(
      deformationTime * 1.18 + node.phaseA + spatialX * 1.04 - spatialY * 0.58,
    ) * this.definition.motion.detailMix

    const structuralX = amplitude * (
      biasedX * stretchX * (0.62 * node.stretchBias)
      + biasedY * shear * (0.34 * node.shearBias)
      + bend * (biasedX * biasedY) * (0.28 + 0.12 * node.shearBias)
      + orbitBand * (0.16 + 0.1 * node.orbitBias)
      + localDetail * (0.08 + 0.14 * node.detailBias)
    )
    const structuralY = amplitude * (
      biasedY * stretchY * (0.64 * node.stretchBias)
      + biasedX * shear * (0.3 * node.shearBias)
      - bend * (biasedX * biasedX - biasedY * biasedY) * (0.22 + 0.1 * node.shearBias)
      + crossBand * (0.16 + 0.12 * node.orbitBias)
      + localDetail * (0.08 + 0.14 * node.detailBias)
    )
    const tangentialAmount = amplitude * 0.16 * (
      Math.sin(deformationTime * 0.58 + node.angle * 1.16 + node.phaseB)
        * (0.44 + 0.18 * node.orbitBias)
      + Math.cos(deformationTime * 0.38 + biasedX + biasedY + node.phaseC)
        * (0.2 + 0.18 * node.detailBias)
    ) * (0.18 + node.radiusRatio * 0.7)

    return {
      x: structuralX + node.tangentX * tangentialAmount,
      y: structuralY + node.tangentY * tangentialAmount,
    }
  }
}

function createRelaxedClusterNodes(
  cluster: NetworkClusterDefinition,
): NetworkNodeSeed[] {
  const random = createSeededRandom(cluster.seed)
  const radiusX = cluster.radius * cluster.aspect
  const radiusY = cluster.radius
  const nodes = Array.from({ length: cluster.nodeCount }, (_, index) => {
    const angle = random() * Math.PI * 2
    const radialWeight = Math.sqrt(random())
    const jitter = 0.78 + random() * 0.22

    return {
      id: index,
      x: Math.cos(angle) * radiusX * radialWeight * jitter,
      y: Math.sin(angle) * radiusY * radialWeight * jitter,
    }
  })

  for (let iteration = 0; iteration < 20; iteration += 1) {
    relaxNodes(nodes, radiusX, radiusY)
  }

  return nodes
}

function relaxNodes(
  nodes: NetworkNodeSeed[],
  radiusX: number,
  radiusY: number,
): void {
  const repulsionStrength = Math.min(radiusX, radiusY) * 0.016
  const centerPull = 0.018

  for (let index = 0; index < nodes.length; index += 1) {
    const current = nodes[index]
    let forceX = -current.x * centerPull
    let forceY = -current.y * centerPull

    for (let neighborIndex = 0; neighborIndex < nodes.length; neighborIndex += 1) {
      if (index === neighborIndex) {
        continue
      }

      const neighbor = nodes[neighborIndex]
      const dx = current.x - neighbor.x
      const dy = current.y - neighbor.y
      const distanceSq = dx * dx + dy * dy + 1
      const force = repulsionStrength / distanceSq

      forceX += dx * force
      forceY += dy * force
    }

    current.x += forceX
    current.y += forceY

    const ellipse = (current.x * current.x) / (radiusX * radiusX)
      + (current.y * current.y) / (radiusY * radiusY)

    if (ellipse > 1) {
      const scale = 1 / Math.sqrt(ellipse)
      current.x *= scale * 0.96
      current.y *= scale * 0.96
    }
  }
}

function createStableClusterEdges(
  nodes: NetworkNodeSeed[],
  maxDistance: number,
  maxNeighborsPerNode: number,
  clusterSeed: number,
): NetworkEdge[] {
  const edges: NetworkEdge[] = []
  const edgeKeys = new Set<string>()
  const connectionsPerNode = new Array<number>(nodes.length).fill(0)
  const weaveBoost = clamp((nodes.length - 12) / 12, 0, 1)
  const connectionLimit = maxNeighborsPerNode + 1 + Math.round(weaveBoost)
  const secondaryConnectionLimit = connectionLimit + 1
  const tertiaryConnectionLimit = secondaryConnectionLimit + 1
  const quaternaryConnectionLimit = tertiaryConnectionLimit + (weaveBoost > 0.5 ? 1 : 0)
  const allPairs = collectNodePairs(nodes)
  const densityBiases = createNodeDensityBiases(nodes, clusterSeed, maxDistance)
  const angularOrder = [...nodes].sort(
    (left, right) => Math.atan2(left.y, left.x) - Math.atan2(right.y, right.x),
  )
  const ringDistanceLimit = maxDistance * 1.28

  for (let index = 0; index < angularOrder.length; index += 1) {
    const current = angularOrder[index]
    const next = angularOrder[(index + 1) % angularOrder.length]
    const distance = Math.hypot(next.x - current.x, next.y - current.y)

    if (distance <= ringDistanceLimit) {
      addStableEdge(
        edges,
        edgeKeys,
        connectionsPerNode,
        current.id,
        next.id,
        connectionLimit,
      )
    }
  }

  const groups = new DisjointSet(nodes.length)

  for (const edge of edges) {
    groups.union(edge.a, edge.b)
  }

  for (const pair of allPairs) {
    if (pair.distance > maxDistance * 1.34) {
      continue
    }

    if (groups.find(pair.a) !== groups.find(pair.b)) {
      const added = addStableEdge(
        edges,
        edgeKeys,
        connectionsPerNode,
        pair.a,
        pair.b,
        connectionLimit,
      )

      if (added) {
        groups.union(pair.a, pair.b)
      }
    }
  }

  const adjacency = createAdjacencySets(nodes.length, edges)
  const secondaryThreshold = (maxNeighborsPerNode >= 4 ? 0.5 : 0.58) - weaveBoost * 0.06
  const maxSecondaryEdges = Math.max(
    1,
    Math.floor(nodes.length * (maxNeighborsPerNode >= 4 ? 0.52 : 0.34 + weaveBoost * 0.18)),
  )
  let addedSecondaryEdges = 0

  for (const pair of allPairs) {
    if (addedSecondaryEdges >= maxSecondaryEdges) {
      break
    }

    if (pair.distance > maxDistance * 0.82) {
      continue
    }

    const sharedNeighbors = countSharedNeighbors(adjacency[pair.a], adjacency[pair.b])

    if (sharedNeighbors === 0) {
      continue
    }

    const distanceScore = 1 - pair.distance / (maxDistance * 0.82)
    const densityScore = (densityBiases[pair.a] + densityBiases[pair.b]) * 0.5
    const score = sharedNeighbors * 0.32 + densityScore * 0.42 + distanceScore * 0.26

    if (score < secondaryThreshold) {
      continue
    }

    const added = addStableEdge(
      edges,
      edgeKeys,
      connectionsPerNode,
      pair.a,
      pair.b,
      secondaryConnectionLimit,
    )

    if (added) {
      adjacency[pair.a].add(pair.b)
      adjacency[pair.b].add(pair.a)
      addedSecondaryEdges += 1
    }
  }

  const tertiaryThreshold = 0.8 - weaveBoost * 0.08
  const maxTertiaryEdges = Math.max(
    1,
    Math.floor(nodes.length * (0.28 + 0.22 * weaveBoost)),
  )
  let addedTertiaryEdges = 0

  for (const pair of allPairs) {
    if (addedTertiaryEdges >= maxTertiaryEdges) {
      break
    }

    if (pair.distance > maxDistance * 0.62) {
      continue
    }

    const sharedNeighbors = countSharedNeighbors(adjacency[pair.a], adjacency[pair.b])

    if (sharedNeighbors < 2) {
      continue
    }

    const densityScore = (densityBiases[pair.a] + densityBiases[pair.b]) * 0.5
    const compactness = 1 - pair.distance / (maxDistance * 0.62)
    const score = sharedNeighbors * 0.4 + densityScore * 0.38 + compactness * 0.22

    if (score < tertiaryThreshold) {
      continue
    }

    const added = addStableEdge(
      edges,
      edgeKeys,
      connectionsPerNode,
      pair.a,
      pair.b,
      tertiaryConnectionLimit,
    )

    if (added) {
      adjacency[pair.a].add(pair.b)
      adjacency[pair.b].add(pair.a)
      addedTertiaryEdges += 1
    }
  }

  const quaternaryThreshold = 1 - weaveBoost * 0.1
  const maxQuaternaryEdges = Math.max(
    1,
    Math.floor(nodes.length * (0.14 + 0.16 * weaveBoost)),
  )
  let addedQuaternaryEdges = 0

  for (const pair of allPairs) {
    if (addedQuaternaryEdges >= maxQuaternaryEdges) {
      break
    }

    if (pair.distance > maxDistance * 0.48) {
      continue
    }

    const sharedNeighbors = countSharedNeighbors(adjacency[pair.a], adjacency[pair.b])

    if (sharedNeighbors < 2) {
      continue
    }

    const densityScore = (densityBiases[pair.a] + densityBiases[pair.b]) * 0.5
    const compactness = 1 - pair.distance / (maxDistance * 0.48)
    const score = sharedNeighbors * 0.46 + densityScore * 0.34 + compactness * 0.2

    if (score < quaternaryThreshold) {
      continue
    }

    const added = addStableEdge(
      edges,
      edgeKeys,
      connectionsPerNode,
      pair.a,
      pair.b,
      quaternaryConnectionLimit,
    )

    if (added) {
      adjacency[pair.a].add(pair.b)
      adjacency[pair.b].add(pair.a)
      addedQuaternaryEdges += 1
    }
  }

  for (const node of nodes) {
    const neighbors = allPairs
      .filter((pair) => pair.a === node.id || pair.b === node.id)
      .filter((pair) => pair.distance <= maxDistance)
      .sort((left, right) => left.distance - right.distance)

    for (const pair of neighbors) {
      if (connectionsPerNode[node.id] >= connectionLimit) {
        break
      }

      const neighborId = pair.a === node.id ? pair.b : pair.a

      addStableEdge(
        edges,
        edgeKeys,
        connectionsPerNode,
        node.id,
        neighborId,
        connectionLimit,
      )
    }
  }

  return edges
}

function createEdgeKey(a: number, b: number): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`
}

function projectAnchor(
  cluster: NetworkClusterDefinition,
  viewport: BackgroundViewport,
): THREE.Vector2 {
  return new THREE.Vector2(
    cluster.anchorX * viewport.width * 0.5,
    cluster.anchorY * viewport.height * 0.5,
  )
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0

  return () => {
    state += 0x6d2b79f5

    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value)

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function normalized(x: number, y: number): { x: number; y: number } {
  const length = Math.hypot(x, y) || 1

  return {
    x: x / length,
    y: y / length,
  }
}

function collectNodePairs(
  nodes: NetworkNodeSeed[],
): Array<{ a: number; b: number; distance: number }> {
  const pairs: Array<{ a: number; b: number; distance: number }> = []

  for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < nodes.length; rightIndex += 1) {
      pairs.push({
        a: nodes[leftIndex].id,
        b: nodes[rightIndex].id,
        distance: Math.hypot(
          nodes[rightIndex].x - nodes[leftIndex].x,
          nodes[rightIndex].y - nodes[leftIndex].y,
        ),
      })
    }
  }

  pairs.sort((left, right) => left.distance - right.distance)
  return pairs
}

function createNodeDensityBiases(
  nodes: NetworkNodeSeed[],
  clusterSeed: number,
  maxDistance: number,
): number[] {
  const random = createSeededRandom(clusterSeed ^ 0x85ebca6b)
  const phaseA = random() * Math.PI * 2
  const phaseB = random() * Math.PI * 2

  return nodes.map((node) => {
    const x = node.x / Math.max(maxDistance, 1)
    const y = node.y / Math.max(maxDistance, 1)
    const radius = Math.hypot(x, y)
    const interiorBias = 1 - clamp(Math.abs(radius - 0.58) / 0.58, 0, 1)
    const field = (
      Math.sin(x * 2.2 + phaseA) * 0.5
      + Math.cos(y * 1.7 + phaseB) * 0.35
      + Math.sin((x - y) * 1.4 + phaseA * 0.5) * 0.15
    ) * 0.5 + 0.5

    return clamp(field * 0.58 + interiorBias * 0.42, 0, 1)
  })
}

function createAdjacencySets(nodeCount: number, edges: NetworkEdge[]): Set<number>[] {
  const adjacency = Array.from({ length: nodeCount }, () => new Set<number>())

  for (const edge of edges) {
    adjacency[edge.a].add(edge.b)
    adjacency[edge.b].add(edge.a)
  }

  return adjacency
}

function countSharedNeighbors(left: Set<number>, right: Set<number>): number {
  let count = 0

  for (const value of left) {
    if (right.has(value)) {
      count += 1
    }
  }

  return count
}

function pickOpacityTier(random: () => number): number {
  const value = random()

  if (value < 0.46) {
    return 0
  }

  if (value < 0.9) {
    return 1
  }

  return 2
}

function selectPulseNodeIndices(
  nodes: NetworkNodeSeed[],
  edges: NetworkEdge[],
  clusterSeed: number,
  desiredCount: number,
): number[] {
  const random = createSeededRandom(clusterSeed ^ 0xc2b2ae35)
  const adjacency = createAdjacencySets(nodes.length, edges)
  const maxRadius = Math.max(
    ...nodes.map((node) => Math.hypot(node.x, node.y)),
    1,
  )
  const scored = nodes
    .map((node) => {
      const radiusRatio = clamp(Math.hypot(node.x, node.y) / maxRadius, 0, 1)
      const degree = adjacency[node.id].size
      const interiorBias = 1 - clamp(Math.abs(radiusRatio - 0.56) / 0.56, 0, 1)

      return {
        id: node.id,
        score: degree * 0.58 + interiorBias * 0.32 + random() * 0.1,
      }
    })
    .sort((left, right) => right.score - left.score)

  const selection: number[] = []
  const targetCount = nodes.length

  for (const candidate of scored) {
    if (selection.length >= targetCount) {
      break
    }

    const adjacentToSelection = selection.some((selected) =>
      adjacency[selected].has(candidate.id),
    )

    if (!adjacentToSelection) {
      selection.push(candidate.id)
    }
  }

  for (const candidate of scored) {
    if (selection.length >= targetCount) {
      break
    }

    if (!selection.includes(candidate.id)) {
      selection.push(candidate.id)
    }
  }

  return selection
}

function addStableEdge(
  edges: NetworkEdge[],
  edgeKeys: Set<string>,
  connectionsPerNode: number[],
  a: number,
  b: number,
  connectionLimit: number,
): boolean {
  if (
    connectionsPerNode[a] >= connectionLimit
    || connectionsPerNode[b] >= connectionLimit
  ) {
    return false
  }

  const key = createEdgeKey(a, b)

  if (edgeKeys.has(key)) {
    return false
  }

  edgeKeys.add(key)
  connectionsPerNode[a] += 1
  connectionsPerNode[b] += 1
  edges.push({ a, b })
  return true
}

class DisjointSet {
  private readonly parent: number[]

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, index) => index)
  }

  find(value: number): number {
    if (this.parent[value] !== value) {
      this.parent[value] = this.find(this.parent[value])
    }

    return this.parent[value]
  }

  union(left: number, right: number): void {
    const leftRoot = this.find(left)
    const rightRoot = this.find(right)

    if (leftRoot !== rightRoot) {
      this.parent[rightRoot] = leftRoot
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function softContain(value: number, innerLimit: number, outerLimit: number): number {
  const sign = Math.sign(value) || 1
  const absolute = Math.abs(value)

  if (absolute <= innerLimit) {
    return value
  }

  const falloff = Math.max(outerLimit - innerLimit, 1)
  const overflow = absolute - innerLimit
  const compressed = innerLimit + falloff * Math.tanh((overflow / falloff) * 1.18)

  return sign * Math.min(compressed, outerLimit)
}
