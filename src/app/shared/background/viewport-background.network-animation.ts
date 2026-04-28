import {
  BackgroundViewport,
  NetworkLayerDefinition,
} from './viewport-background.models'
import {
  ClusterRuntimeState,
  MutableClusterTransform,
  MutableNodeOffset,
  PulseNodeBinding,
} from './viewport-background.network-types'
import {
  readFieldX,
  readFieldY,
  readLocalDriftX,
  readLocalDriftY,
  readViewportDriftX,
  readViewportDriftY,
} from './viewport-background.network-geometry'
import { softContain } from './viewport-background.network-utils'

export function createClusterTransformScratch(): MutableClusterTransform {
  return { centerX: 0, centerY: 0, scaleX: 1, scaleY: 1, rotation: 0 }
}

export function createNodeOffsetScratch(): MutableNodeOffset {
  return { x: 0, y: 0 }
}

export function writeAnimatedLayerPositions(
  nowMs: number,
  clusters: ClusterRuntimeState[],
  pulseBindings: PulseNodeBinding[],
  context: AnimationContext,
): void {
  const time = createAnimationTime(nowMs, context.definition)
  clusters.forEach((cluster) => writeClusterPositions(cluster, time, context))
  writePulsePositions(pulseBindings, clusters, context.pulsePositions)
}

export interface AnimationContext {
  definition: NetworkLayerDefinition
  viewport: BackgroundViewport
  linePositionsByTier: Float32Array[]
  pointPositionsByTier: Float32Array[]
  pulsePositions: Float32Array
  clusterTransform: MutableClusterTransform
  nodeOffset: MutableNodeOffset
}

interface AnimationTime {
  drift: number
  morph: number
  sweep: number
  deformation: number
}

function createAnimationTime(nowMs: number, definition: NetworkLayerDefinition): AnimationTime {
  const time = nowMs * 0.001
  return {
    drift: time * definition.motion.driftSpeed,
    morph: time * definition.motion.morphSpeed,
    sweep: time * definition.motion.sweepSpeed,
    deformation: time * definition.motion.deformationSpeed,
  }
}

function writeClusterPositions(
  cluster: ClusterRuntimeState,
  time: AnimationTime,
  context: AnimationContext,
): void {
  const transform = readClusterTransform(cluster, time, context)
  writeClusterNodePositions(cluster, transform, time.deformation, context)
  writeClusterEdgePositions(cluster, context.linePositionsByTier[cluster.opacityTier])
}

function writeClusterNodePositions(
  cluster: ClusterRuntimeState,
  transform: MutableClusterTransform,
  deformationTime: number,
  context: AnimationContext,
): void {
  const rotation = { cos: Math.cos(transform.rotation), sin: Math.sin(transform.rotation) }
  let cursor = cluster.tierPointOffset
  for (let index = 0; index < cluster.nodes.length; index += 1) {
    cursor = writeClusterNodePosition(cluster, index, cursor, transform, rotation, deformationTime, context)
  }
}

function writeClusterNodePosition(
  cluster: ClusterRuntimeState,
  index: number,
  cursor: number,
  transform: MutableClusterTransform,
  rotation: { cos: number; sin: number },
  deformationTime: number,
  context: AnimationContext,
): number {
  const world = readNodeWorldPosition(cluster, index, transform, rotation, deformationTime, context)
  writeWorldPosition(cluster.worldPositions, index * 2, world.x, world.y)
  writePointPosition(context.pointPositionsByTier[cluster.opacityTier], cursor, world.x, world.y)
  return cursor + 3
}

function readNodeWorldPosition(
  cluster: ClusterRuntimeState,
  index: number,
  transform: MutableClusterTransform,
  rotation: { cos: number; sin: number },
  deformationTime: number,
  context: AnimationContext,
): { x: number; y: number } {
  const node = cluster.nodes[index]
  const offset = readNodeOffset(cluster, node, deformationTime, context)
  const local = readTransformedLocalNode(node.baseX + offset.x, node.baseY + offset.y, transform)
  return rotateNodeIntoWorld(local.x, local.y, transform, rotation)
}

function readTransformedLocalNode(
  x: number,
  y: number,
  transform: MutableClusterTransform,
): { x: number; y: number } {
  return { x: x * transform.scaleX, y: y * transform.scaleY }
}

function rotateNodeIntoWorld(
  localX: number,
  localY: number,
  transform: MutableClusterTransform,
  rotation: { cos: number; sin: number },
): { x: number; y: number } {
  return {
    x: transform.centerX + localX * rotation.cos - localY * rotation.sin,
    y: transform.centerY + localX * rotation.sin + localY * rotation.cos,
  }
}

function writeClusterEdgePositions(cluster: ClusterRuntimeState, positions: Float32Array): void {
  let cursor = cluster.tierLineOffset
  for (const edge of cluster.edges) {
    writeClusterEdgePosition(cluster, edge.a, edge.b, positions, cursor)
    cursor += 6
  }
}

function writeClusterEdgePosition(
  cluster: ClusterRuntimeState,
  startIndex: number,
  endIndex: number,
  positions: Float32Array,
  cursor: number,
): void {
  const startCursor = startIndex * 2
  const endCursor = endIndex * 2
  positions[cursor] = cluster.worldPositions[startCursor]
  positions[cursor + 1] = cluster.worldPositions[startCursor + 1]
  positions[cursor + 3] = cluster.worldPositions[endCursor]
  positions[cursor + 4] = cluster.worldPositions[endCursor + 1]
}

function writePulsePositions(
  bindings: PulseNodeBinding[],
  clusters: ClusterRuntimeState[],
  positions: Float32Array,
): void {
  bindings.forEach((binding, index) => writePulsePosition(binding, index, clusters, positions))
}

function writePulsePosition(
  binding: PulseNodeBinding,
  index: number,
  clusters: ClusterRuntimeState[],
  positions: Float32Array,
): void {
  const cluster = clusters[binding.clusterIndex]
  const nodeCursor = binding.nodeIndex * 2
  const pulseCursor = index * 3
  positions[pulseCursor] = cluster.worldPositions[nodeCursor]
  positions[pulseCursor + 1] = cluster.worldPositions[nodeCursor + 1]
}

function readClusterTransform(
  cluster: ClusterRuntimeState,
  time: AnimationTime,
  context: AnimationContext,
): MutableClusterTransform {
  const center = readClusterCenter(cluster, time.drift, context)
  const scale = readClusterScale(cluster, time.morph, context.definition)
  context.clusterTransform.centerX = containCenterX(center.x, cluster, context.viewport)
  context.clusterTransform.centerY = containCenterY(center.y, cluster, context.viewport)
  context.clusterTransform.scaleX = scale.x
  context.clusterTransform.scaleY = scale.y
  context.clusterTransform.rotation = readClusterRotation(cluster, time.sweep, context.definition)
  return context.clusterTransform
}

function readClusterCenter(
  cluster: ClusterRuntimeState,
  driftTime: number,
  context: AnimationContext,
): { x: number; y: number } {
  const field = readClusterFieldOffset(cluster, driftTime, context)
  const viewport = readClusterViewportDrift(cluster, driftTime, context)
  const local = readClusterLocalDrift(cluster, driftTime, context.definition)
  return { x: cluster.restCenterX + field.x + viewport.x + local.x, y: cluster.restCenterY + field.y + viewport.y + local.y }
}

function readClusterFieldOffset(
  cluster: ClusterRuntimeState,
  driftTime: number,
  context: AnimationContext,
): { x: number; y: number } {
  return {
    x: context.viewport.width * context.definition.motion.viewportDriftRange * (readFieldX(cluster, driftTime) - cluster.fieldX0) * cluster.viewportDriftX,
    y: context.viewport.height * context.definition.motion.viewportDriftRange * 0.92 * (readFieldY(cluster, driftTime) - cluster.fieldY0) * cluster.viewportDriftY,
  }
}

function readClusterViewportDrift(
  cluster: ClusterRuntimeState,
  driftTime: number,
  context: AnimationContext,
): { x: number; y: number } {
  const amplitude = context.viewport.minDimension * context.definition.motion.viewportDriftRange
  return { x: amplitude * (readViewportDriftX(cluster, driftTime) - cluster.viewportDriftX0), y: amplitude * (readViewportDriftY(cluster, driftTime) - cluster.viewportDriftY0) }
}

function readClusterLocalDrift(
  cluster: ClusterRuntimeState,
  driftTime: number,
  definition: NetworkLayerDefinition,
): { x: number; y: number } {
  const amplitude = cluster.radius * definition.motion.clusterOffsetRange
  return { x: amplitude * (readLocalDriftX(cluster, driftTime) - cluster.localDriftX0), y: amplitude * (readLocalDriftY(cluster, driftTime) - cluster.localDriftY0) }
}

function readClusterScale(
  cluster: ClusterRuntimeState,
  morphTime: number,
  definition: NetworkLayerDefinition,
): { x: number; y: number } {
  const base = readClusterScaleBase(cluster, morphTime, definition)
  const spread = definition.motion.scaleRange * 0.34 * Math.sin(morphTime * 0.61 + cluster.phaseE)
  return { x: base + spread, y: base - spread * 0.88 }
}

function readClusterScaleBase(
  cluster: ClusterRuntimeState,
  morphTime: number,
  definition: NetworkLayerDefinition,
): number {
  const wave = Math.sin(morphTime * 0.92 + cluster.phaseC) * 0.58
    + Math.sin(morphTime * 0.41 + cluster.phaseD) * 0.42
  return 1 + definition.motion.scaleRange * wave
}

function readClusterRotation(
  cluster: ClusterRuntimeState,
  sweepTime: number,
  definition: NetworkLayerDefinition,
): number {
  const wave = Math.sin(sweepTime * 0.64 + cluster.phaseE) * 0.58
    + Math.sin(sweepTime * 0.29 + cluster.phaseF) * 0.42
  return definition.motion.rotationRange * wave
}

function readNodeOffset(
  cluster: ClusterRuntimeState,
  node: ClusterRuntimeState['nodes'][number],
  deformationTime: number,
  context: AnimationContext,
): MutableNodeOffset {
  const structural = readStructuralOffset(cluster, node, deformationTime, context.definition)
  const tangential = readTangentialOffset(node, deformationTime)
  context.nodeOffset.x = structural.x + node.tangentX * tangential
  context.nodeOffset.y = structural.y + node.tangentY * tangential
  return context.nodeOffset
}

function readStructuralOffset(
  cluster: ClusterRuntimeState,
  node: ClusterRuntimeState['nodes'][number],
  time: number,
  definition: NetworkLayerDefinition,
): { x: number; y: number } {
  const waves = readStructuralWaves(cluster, node, time, definition)
  return { x: node.baseAmplitude * readStructuralX(node, waves), y: node.baseAmplitude * readStructuralY(node, waves) }
}

function readStructuralWaves(
  cluster: ClusterRuntimeState,
  node: ClusterRuntimeState['nodes'][number],
  time: number,
  definition: NetworkLayerDefinition,
) {
  return {
    stretchX: Math.sin(time * 0.86 + cluster.phaseA),
    stretchY: Math.cos(time * 0.64 + cluster.phaseB),
    shear: Math.sin(time * 0.52 + cluster.phaseC),
    bend: Math.cos(time * 0.41 + cluster.phaseD),
    orbit: Math.sin(time * 0.94 + node.orbitPhase),
    cross: Math.cos(time * 0.72 + node.crossPhase),
    detail: Math.sin(time * 1.18 + node.detailPhase) * definition.motion.detailMix,
  }
}

function readStructuralX(node: ClusterRuntimeState['nodes'][number], waves: ReturnType<typeof readStructuralWaves>): number {
  return node.biasedX * waves.stretchX * (0.62 * node.stretchBias)
    + node.biasedY * waves.shear * (0.34 * node.shearBias)
    + waves.bend * (node.biasedX * node.biasedY) * (0.28 + 0.12 * node.shearBias)
    + waves.orbit * (0.16 + 0.1 * node.orbitBias)
    + waves.detail * (0.08 + 0.14 * node.detailBias)
}

function readStructuralY(node: ClusterRuntimeState['nodes'][number], waves: ReturnType<typeof readStructuralWaves>): number {
  return node.biasedY * waves.stretchY * (0.64 * node.stretchBias)
    + node.biasedX * waves.shear * (0.3 * node.shearBias)
    - waves.bend * (node.biasedX * node.biasedX - node.biasedY * node.biasedY) * (0.22 + 0.1 * node.shearBias)
    + waves.cross * (0.16 + 0.12 * node.orbitBias)
    + waves.detail * (0.08 + 0.14 * node.detailBias)
}

function readTangentialOffset(node: ClusterRuntimeState['nodes'][number], time: number): number {
  const wave = Math.sin(time * 0.58 + node.tangentialPhaseA) * (0.44 + 0.18 * node.orbitBias)
    + Math.cos(time * 0.38 + node.tangentialPhaseB) * (0.2 + 0.18 * node.detailBias)
  return node.baseAmplitude * 0.16 * wave * (0.18 + node.radiusRatio * 0.7)
}

function writeWorldPosition(positions: Float32Array, cursor: number, x: number, y: number): void {
  positions[cursor] = x
  positions[cursor + 1] = y
}

function writePointPosition(positions: Float32Array, cursor: number, x: number, y: number): void {
  positions[cursor] = x
  positions[cursor + 1] = y
}

function containCenterX(value: number, cluster: ClusterRuntimeState, viewport: BackgroundViewport): number {
  return softContain(value, viewport.width * 0.39, viewport.width * 0.52 + cluster.radius * 0.36)
}

function containCenterY(value: number, cluster: ClusterRuntimeState, viewport: BackgroundViewport): number {
  return softContain(value, viewport.height * 0.37, viewport.height * 0.5 + cluster.radius * 0.34)
}
