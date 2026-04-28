import {
  BackgroundViewport,
  NetworkClusterDefinition,
  NetworkEdge,
  NetworkLayerDefinition,
  NetworkNodeSeed,
} from './viewport-background.models'
import { OPACITY_TIER_COUNT } from './viewport-background.network-constants'
import { createStableClusterEdges } from './viewport-background.network-edges'
import { createRelaxedClusterNodes } from './viewport-background.network-nodes'
import { selectPulseNodeIndices } from './viewport-background.network-pulses'
import {
  AnimatedNodeState,
  ClusterRuntimeState,
  LayerGeometry,
  PulseNodeBinding,
} from './viewport-background.network-types'
import {
  clamp,
  createSeededRandom,
  normalized,
  projectAnchor,
} from './viewport-background.network-utils'

interface GeometryBuildState {
  totalPointsByTier: number[]
  totalLineSegmentsByTier: number[]
  clusters: ClusterRuntimeState[]
  pulseBindings: PulseNodeBinding[]
}

interface ClusterMotionSeeds {
  phaseA: number
  phaseB: number
  phaseC: number
  phaseD: number
  phaseE: number
  phaseF: number
  asymmetryX: number
  asymmetryY: number
  viewportDriftX: number
  viewportDriftY: number
}

export function buildLayerGeometry(
  definition: NetworkLayerDefinition,
  viewport: BackgroundViewport,
): LayerGeometry {
  const state = createGeometryBuildState()
  definition.clusters.forEach((cluster) => addClusterGeometry(state, cluster, definition, viewport))
  return createLayerGeometry(state)
}

function createGeometryBuildState(): GeometryBuildState {
  return {
    totalPointsByTier: new Array<number>(OPACITY_TIER_COUNT).fill(0),
    totalLineSegmentsByTier: new Array<number>(OPACITY_TIER_COUNT).fill(0),
    clusters: [],
    pulseBindings: [],
  }
}

function addClusterGeometry(
  state: GeometryBuildState,
  cluster: NetworkClusterDefinition,
  definition: NetworkLayerDefinition,
  viewport: BackgroundViewport,
): void {
  const input = createClusterRuntimeInput(state, cluster, definition)
  state.clusters.push(createRuntimeCluster(cluster, definition, viewport, input))
  state.totalPointsByTier[input.opacityTier] += input.runtimeNodes.length
  state.totalLineSegmentsByTier[input.opacityTier] += input.edges.length
  addPulseBindings(state, input, definition.pulseNodeCount)
}

function createClusterRuntimeInput(
  state: GeometryBuildState,
  cluster: NetworkClusterDefinition,
  definition: NetworkLayerDefinition,
): {
  random: () => number
  nodes: NetworkNodeSeed[]
  runtimeNodes: AnimatedNodeState[]
  edges: NetworkEdge[]
  opacityTier: number
  tierPointOffset: number
  tierLineOffset: number
  clusterIndex: number
  clusterSeed: number
} {
  const random = createSeededRandom(cluster.seed ^ 0x9e3779b9)
  const nodes = createRelaxedClusterNodes(cluster)
  const edges = createClusterEdges(nodes, cluster, definition)
  const opacityTier = pickOpacityTier(random)
  return createClusterRuntimeInputValue(state, cluster, definition, random, nodes, edges, opacityTier)
}

function createClusterRuntimeInputValue(
  state: GeometryBuildState,
  cluster: NetworkClusterDefinition,
  definition: NetworkLayerDefinition,
  random: () => number,
  nodes: NetworkNodeSeed[],
  edges: NetworkEdge[],
  opacityTier: number,
) {
  return {
    random,
    nodes,
    edges,
    opacityTier,
    runtimeNodes: createAnimatedNodes(nodes, cluster, definition, random),
    tierPointOffset: state.totalPointsByTier[opacityTier] * 3,
    tierLineOffset: state.totalLineSegmentsByTier[opacityTier] * 6,
    clusterIndex: state.clusters.length,
    clusterSeed: cluster.seed,
  }
}

function createClusterEdges(
  nodes: NetworkNodeSeed[],
  cluster: NetworkClusterDefinition,
  definition: NetworkLayerDefinition,
): NetworkEdge[] {
  return createStableClusterEdges(
    nodes,
    cluster.radius * definition.edgeDistanceFactor,
    definition.maxNeighborsPerNode,
    cluster.seed,
  )
}

function createAnimatedNodes(
  nodes: NetworkNodeSeed[],
  cluster: NetworkClusterDefinition,
  definition: NetworkLayerDefinition,
  random: () => number,
): AnimatedNodeState[] {
  return nodes.map((node) => createAnimatedNode(node, cluster, definition, random))
}

function createAnimatedNode(
  seed: NetworkNodeSeed,
  cluster: NetworkClusterDefinition,
  definition: NetworkLayerDefinition,
  random: () => number,
): AnimatedNodeState {
  const node = createBaseAnimatedNode(seed, cluster, definition, random)
  assignNodeBasis(node, seed)
  assignNodePhases(node, random)
  assignNodeBiases(node, random)
  return node
}

function createBaseAnimatedNode(
  seed: NetworkNodeSeed,
  cluster: NetworkClusterDefinition,
  definition: NetworkLayerDefinition,
  random: () => number,
): AnimatedNodeState {
  const radiusRatio = readNodeRadiusRatio(seed, cluster)
  const amplitudeBias = 0.72 + random() * 0.56
  return createEmptyAnimatedNode(seed, cluster, definition, radiusRatio, amplitudeBias)
}

function createEmptyAnimatedNode(
  seed: NetworkNodeSeed,
  cluster: NetworkClusterDefinition,
  definition: NetworkLayerDefinition,
  radiusRatio: number,
  amplitudeBias: number,
): AnimatedNodeState {
  return {
    id: seed.id, baseX: seed.x, baseY: seed.y, angle: Math.atan2(seed.y, seed.x),
    radiusRatio, spatialX: seed.x / Math.max(cluster.radius, 1), spatialY: seed.y / Math.max(cluster.radius, 1),
    biasedX: 0, biasedY: 0, baseAmplitude: readNodeBaseAmplitude(cluster, definition, radiusRatio, amplitudeBias),
    radialX: 0, radialY: 0, tangentX: 0, tangentY: 0, phaseA: 0, phaseB: 0, phaseC: 0,
    orbitPhase: 0, crossPhase: 0, detailPhase: 0, tangentialPhaseA: 0, tangentialPhaseB: 0,
    amplitudeBias, stretchBias: 0, shearBias: 0, orbitBias: 0, detailBias: 0,
  }
}

function assignNodeBasis(node: AnimatedNodeState, seed: NetworkNodeSeed): void {
  const basis = normalized(seed.x, seed.y)
  node.radialX = basis.x
  node.radialY = basis.y
  node.tangentX = -basis.y
  node.tangentY = basis.x
}

function assignNodePhases(node: AnimatedNodeState, random: () => number): void {
  node.phaseA = random() * Math.PI * 2
  node.phaseB = random() * Math.PI * 2
  node.phaseC = random() * Math.PI * 2
}

function assignNodeBiases(node: AnimatedNodeState, random: () => number): void {
  node.stretchBias = 0.7 + random() * 0.6
  node.shearBias = 0.65 + random() * 0.7
  node.orbitBias = 0.7 + random() * 0.6
  node.detailBias = 0.55 + random() * 0.9
}

function createRuntimeCluster(
  cluster: NetworkClusterDefinition,
  definition: NetworkLayerDefinition,
  viewport: BackgroundViewport,
  input: ReturnType<typeof createClusterRuntimeInputValue>,
): ClusterRuntimeState {
  const center = projectAnchor(cluster, viewport)
  const motion = createClusterMotionSeeds(input.random)
  prepareAnimatedNodes(input.runtimeNodes, motion)
  return createRuntimeClusterValue(cluster, center, motion, input)
}

function createRuntimeClusterValue(
  cluster: NetworkClusterDefinition,
  center: { x: number; y: number },
  motion: ClusterMotionSeeds,
  input: ReturnType<typeof createClusterRuntimeInputValue>,
): ClusterRuntimeState {
  return {
    restCenterX: center.x, restCenterY: center.y, opacityTier: input.opacityTier,
    tierPointOffset: input.tierPointOffset, tierLineOffset: input.tierLineOffset,
    nodes: input.runtimeNodes, edges: input.edges, worldPositions: new Float32Array(input.runtimeNodes.length * 2),
    radius: cluster.radius, ...motion, ...createClusterMotionBaselines(motion),
  }
}

function createClusterMotionSeeds(random: () => number): ClusterMotionSeeds {
  return {
    phaseA: random() * Math.PI * 2, phaseB: random() * Math.PI * 2,
    phaseC: random() * Math.PI * 2, phaseD: random() * Math.PI * 2,
    phaseE: random() * Math.PI * 2, phaseF: random() * Math.PI * 2,
    asymmetryX: random() * 2 - 1, asymmetryY: random() * 2 - 1,
    viewportDriftX: readSignedDrift(random), viewportDriftY: readSignedDrift(random),
  }
}

function createClusterMotionBaselines(motion: ClusterMotionSeeds) {
  return {
    fieldX0: readFieldX(motion, 0), fieldY0: readFieldY(motion, 0),
    viewportDriftX0: readViewportDriftX(motion, 0),
    viewportDriftY0: readViewportDriftY(motion, 0),
    localDriftX0: readLocalDriftX(motion, 0), localDriftY0: readLocalDriftY(motion, 0),
  }
}

function prepareAnimatedNodes(nodes: AnimatedNodeState[], motion: ClusterMotionSeeds): void {
  for (const node of nodes) {
    prepareAnimatedNode(node, motion)
  }
}

function prepareAnimatedNode(node: AnimatedNodeState, motion: ClusterMotionSeeds): void {
  node.biasedX = node.spatialX + motion.asymmetryX * 0.32
  node.biasedY = node.spatialY + motion.asymmetryY * 0.32
  node.orbitPhase = node.angle * 1.62 + motion.phaseE
  node.crossPhase = (node.spatialX - node.spatialY) * 1.94 + motion.phaseF
  node.detailPhase = node.phaseA + node.spatialX * 1.04 - node.spatialY * 0.58
  node.tangentialPhaseA = node.angle * 1.16 + node.phaseB
  node.tangentialPhaseB = node.biasedX + node.biasedY + node.phaseC
}

function addPulseBindings(
  state: GeometryBuildState,
  input: ReturnType<typeof createClusterRuntimeInputValue>,
  desiredCount: number,
): void {
  const nodeIndices = selectPulseNodeIndices(input.nodes, input.edges, input.clusterSeed, desiredCount)
  nodeIndices.forEach((nodeIndex) => addPulseBinding(state, input, nodeIndex))
}

function addPulseBinding(
  state: GeometryBuildState,
  input: ReturnType<typeof createClusterRuntimeInputValue>,
  nodeIndex: number,
): void {
  state.pulseBindings.push({
    clusterIndex: input.clusterIndex,
    nodeIndex,
    phase: input.random() * Math.PI * 2,
    rate: 0.72 + input.random() * 1.12,
    weight: 0.86 + input.random() * 0.18,
  })
}

function createLayerGeometry(state: GeometryBuildState): LayerGeometry {
  const pulseData = createPulseData(state.pulseBindings)
  return {
    clusters: state.clusters,
    pulseBindings: state.pulseBindings,
    linePositionsByTier: createLinePositionArrays(state),
    pointPositionsByTier: createPointPositionArrays(state),
    ...pulseData,
  }
}

function createLinePositionArrays(state: GeometryBuildState): Float32Array[] {
  return state.totalLineSegmentsByTier.map((count) => new Float32Array(count * 6))
}

function createPointPositionArrays(state: GeometryBuildState): Float32Array[] {
  return state.totalPointsByTier.map((count) => new Float32Array(count * 3))
}

function createPulseData(pulseBindings: PulseNodeBinding[]) {
  const pulsePhases = new Float32Array(pulseBindings.length)
  const pulseRates = new Float32Array(pulseBindings.length)
  const pulseWeights = new Float32Array(pulseBindings.length)
  writePulseAttributes(pulseBindings, pulsePhases, pulseRates, pulseWeights)
  return { pulsePositions: new Float32Array(pulseBindings.length * 3), pulsePhases, pulseRates, pulseWeights }
}

function writePulseAttributes(
  bindings: PulseNodeBinding[],
  phases: Float32Array,
  rates: Float32Array,
  weights: Float32Array,
): void {
  bindings.forEach((binding, index) => writePulseAttribute(binding, index, phases, rates, weights))
}

function writePulseAttribute(
  binding: PulseNodeBinding,
  index: number,
  phases: Float32Array,
  rates: Float32Array,
  weights: Float32Array,
): void {
  phases[index] = binding.phase
  rates[index] = binding.rate
  weights[index] = binding.weight
}

function readNodeRadiusRatio(seed: NetworkNodeSeed, cluster: NetworkClusterDefinition): number {
  const radius = Math.hypot(seed.x, seed.y) / Math.max(cluster.radius * cluster.aspect, 1)
  return clamp(radius, 0.18, 1)
}

function readNodeBaseAmplitude(
  cluster: NetworkClusterDefinition,
  definition: NetworkLayerDefinition,
  radiusRatio: number,
  amplitudeBias: number,
): number {
  return cluster.radius * definition.motion.nodeOffsetRange * (0.34 + radiusRatio * 0.84) * amplitudeBias
}

function pickOpacityTier(random: () => number): number {
  const value = random()
  if (value < 0.46) {
    return 0
  }
  return value < 0.9 ? 1 : 2
}

function readSignedDrift(random: () => number): number {
  return (random() < 0.5 ? -1 : 1) * (0.7 + random() * 0.6)
}

export function readFieldX(motion: ClusterMotionSeeds, time: number): number {
  return Math.sin(time * 0.19 + motion.phaseA) * 0.42
    + Math.sin(time * 0.11 + motion.phaseC) * 0.33
    + Math.cos(time * 0.07 + motion.phaseE) * 0.25
}

export function readFieldY(motion: ClusterMotionSeeds, time: number): number {
  return Math.cos(time * 0.17 + motion.phaseB) * 0.38
    + Math.sin(time * 0.09 + motion.phaseD) * 0.34
    + Math.cos(time * 0.05 + motion.phaseF) * 0.28
}

export function readViewportDriftX(motion: ClusterMotionSeeds, time: number): number {
  return (Math.sin(time * 0.21 + motion.phaseA) * 0.64
    + Math.cos(time * 0.11 + motion.phaseD) * 0.36) * motion.viewportDriftX
}

export function readViewportDriftY(motion: ClusterMotionSeeds, time: number): number {
  return (Math.cos(time * 0.17 + motion.phaseB) * 0.58
    + Math.sin(time * 0.09 + motion.phaseE) * 0.42) * motion.viewportDriftY
}

export function readLocalDriftX(motion: ClusterMotionSeeds, time: number): number {
  return Math.sin(time + motion.phaseA) * 0.62
    + Math.sin(time * 0.43 + motion.phaseB) * 0.38
}

export function readLocalDriftY(motion: ClusterMotionSeeds, time: number): number {
  return Math.cos(time * 0.88 + motion.phaseC) * 0.56
    + Math.sin(time * 0.37 + motion.phaseD) * 0.44
}
