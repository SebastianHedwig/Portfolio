import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  Group,
  LineBasicMaterial,
  LineSegments,
  Material,
  NormalBlending,
  Object3D,
  Points,
  PointsMaterial,
  ShaderMaterial,
} from 'three'

import { NetworkLayerDefinition } from './viewport-background.models'
import {
  LINE_OPACITY_TIERS,
  OPACITY_TIER_COUNT,
  POINT_OPACITY_TIERS,
  POINT_SIZE_TIERS,
} from './viewport-background.network-constants'
import { LayerGeometry } from './viewport-background.network-types'

export interface NetworkRenderResources {
  lineGeometries: BufferGeometry[]
  pointGeometries: BufferGeometry[]
  pulseGeometry: BufferGeometry
  linePositionAttributes: BufferAttribute[]
  pointPositionAttributes: BufferAttribute[]
  pulsePositionAttribute: BufferAttribute
  pulseMaterial: ShaderMaterial
}

export function createNetworkRenderResources(
  definition: NetworkLayerDefinition,
  geometry: LayerGeometry,
): NetworkRenderResources {
  const resources = createBaseRenderResources(definition, geometry)
  attachPulseAttributes(resources.pulseGeometry, resources.pulsePositionAttribute, geometry)
  setDynamicUsage(resources)
  return resources
}

export function createNetworkGroup(
  definition: NetworkLayerDefinition,
  resources: NetworkRenderResources,
): Group {
  const group = createEmptyNetworkGroup(definition)
  for (let tier = 0; tier < OPACITY_TIER_COUNT; tier += 1) {
    group.add(createLines(definition, resources, tier))
    group.add(createPoints(definition, resources, tier))
  }
  group.add(createPulsePoints(definition, resources))
  return group
}

export function markNetworkAttributesForUpdate(resources: NetworkRenderResources): void {
  resources.linePositionAttributes.forEach(markAttributeForUpdate)
  resources.pointPositionAttributes.forEach(markAttributeForUpdate)
  resources.pulsePositionAttribute.needsUpdate = true
}

export function setPulseMaterialTime(resources: NetworkRenderResources, nowMs: number): void {
  resources.pulseMaterial.uniforms['uTime'].value = nowMs * 0.001
}

export function disposeNetworkResources(
  group: Group,
  resources: NetworkRenderResources,
): void {
  resources.lineGeometries.forEach((geometry) => geometry.dispose())
  resources.pointGeometries.forEach((geometry) => geometry.dispose())
  resources.pulseGeometry.dispose()
  resources.pulseMaterial.dispose()
  group.traverse((child) => disposeRenderableMaterial(child, resources.pulseMaterial))
}

function createBaseRenderResources(
  definition: NetworkLayerDefinition,
  geometry: LayerGeometry,
): NetworkRenderResources {
  const lineGeometries = createGeometries(geometry.linePositionsByTier)
  const pointGeometries = createGeometries(geometry.pointPositionsByTier)
  const pulsePositionAttribute = new BufferAttribute(geometry.pulsePositions, 3)
  return {
    lineGeometries, pointGeometries, pulseGeometry: new BufferGeometry(),
    linePositionAttributes: readPositionAttributes(lineGeometries),
    pointPositionAttributes: readPositionAttributes(pointGeometries),
    pulsePositionAttribute, pulseMaterial: createPulseMaterial(definition),
  }
}

function createGeometries(positionArrays: Float32Array[]): BufferGeometry[] {
  return positionArrays.map((positions) => createGeometry(positions))
}

function createGeometry(positions: Float32Array): BufferGeometry {
  return new BufferGeometry().setAttribute(
    'position',
    new BufferAttribute(positions, 3),
  )
}

function readPositionAttributes(geometries: BufferGeometry[]): BufferAttribute[] {
  return geometries.map((geometry) =>
    geometry.getAttribute('position') as BufferAttribute,
  )
}

function attachPulseAttributes(
  geometry: BufferGeometry,
  position: BufferAttribute,
  data: LayerGeometry,
): void {
  geometry.setAttribute('position', position)
  geometry.setAttribute('pulsePhase', new BufferAttribute(data.pulsePhases, 1))
  geometry.setAttribute('pulseRate', new BufferAttribute(data.pulseRates, 1))
  geometry.setAttribute('pulseWeight', new BufferAttribute(data.pulseWeights, 1))
}

function setDynamicUsage(resources: NetworkRenderResources): void {
  resources.linePositionAttributes.forEach(setAttributeDynamicUsage)
  resources.pointPositionAttributes.forEach(setAttributeDynamicUsage)
  resources.pulsePositionAttribute.setUsage(DynamicDrawUsage)
}

function setAttributeDynamicUsage(attribute: BufferAttribute): void {
  attribute.setUsage(DynamicDrawUsage)
}

function createEmptyNetworkGroup(definition: NetworkLayerDefinition): Group {
  const group = new Group()
  group.position.z = definition.zOffset
  group.renderOrder = definition.renderOrder
  return group
}

function createLines(
  definition: NetworkLayerDefinition,
  resources: NetworkRenderResources,
  tier: number,
): LineSegments {
  const lines = new LineSegments(resources.lineGeometries[tier], createLineMaterial(definition, tier))
  lines.renderOrder = definition.renderOrder + tier * 0.01
  lines.frustumCulled = false
  return lines
}

function createPoints(
  definition: NetworkLayerDefinition,
  resources: NetworkRenderResources,
  tier: number,
): Points {
  const points = new Points(resources.pointGeometries[tier], createPointMaterial(definition, tier))
  points.renderOrder = definition.renderOrder + tier * 0.01
  points.frustumCulled = false
  return points
}

function createPulsePoints(
  definition: NetworkLayerDefinition,
  resources: NetworkRenderResources,
): Points {
  const points = new Points(resources.pulseGeometry, resources.pulseMaterial)
  points.renderOrder = definition.renderOrder + 1
  points.frustumCulled = false
  return points
}

function createLineMaterial(definition: NetworkLayerDefinition, tier: number): LineBasicMaterial {
  return new LineBasicMaterial({
    color: definition.lineColor,
    transparent: true,
    opacity: definition.lineOpacity * LINE_OPACITY_TIERS[tier],
    depthWrite: false,
    blending: NormalBlending,
  })
}

function createPointMaterial(definition: NetworkLayerDefinition, tier: number): PointsMaterial {
  return new PointsMaterial({
    color: definition.pointColor,
    size: definition.pointSize * POINT_SIZE_TIERS[tier],
    sizeAttenuation: false,
    transparent: true,
    opacity: definition.pointOpacity * POINT_OPACITY_TIERS[tier],
    depthWrite: false,
  })
}

function createPulseMaterial(definition: NetworkLayerDefinition): ShaderMaterial {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: NormalBlending,
    uniforms: createPulseUniforms(definition),
    vertexShader: PULSE_VERTEX_SHADER,
    fragmentShader: PULSE_FRAGMENT_SHADER,
  })
}

function createPulseUniforms(definition: NetworkLayerDefinition) {
  return {
    uTime: { value: 0 },
    uColor: { value: new Color(definition.pointColor) },
    uBaseSize: { value: definition.pointSize * definition.pulseSizeScale },
    uBaseOpacity: { value: definition.pulseOpacity },
    uPulseSpeed: { value: definition.pulseSpeed },
  }
}

function markAttributeForUpdate(attribute: BufferAttribute): void {
  attribute.needsUpdate = true
}

function disposeRenderableMaterial(child: Object3D, pulseMaterial: ShaderMaterial): void {
  const material = (child as LineSegments | Points).material
  if (Array.isArray(material)) {
    material.forEach((entry) => entry.dispose())
    return
  }
  disposeMaterial(material, pulseMaterial)
}

function disposeMaterial(
  material: Material | undefined,
  pulseMaterial: ShaderMaterial,
): void {
  if (material && material !== pulseMaterial) {
    material.dispose()
  }
}

const PULSE_VERTEX_SHADER = `
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
`

const PULSE_FRAGMENT_SHADER = `
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
`
