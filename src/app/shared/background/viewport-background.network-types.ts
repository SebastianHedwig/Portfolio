import { NetworkEdge } from './viewport-background.models'

export interface FlattenedLayerGeometry {
  linePositionsByTier: Float32Array[]
  pointPositionsByTier: Float32Array[]
  pulsePositions: Float32Array
  pulsePhases: Float32Array
  pulseRates: Float32Array
  pulseWeights: Float32Array
}

export interface AnimatedNodeState {
  id: number
  baseX: number
  baseY: number
  angle: number
  radiusRatio: number
  spatialX: number
  spatialY: number
  biasedX: number
  biasedY: number
  baseAmplitude: number
  radialX: number
  radialY: number
  tangentX: number
  tangentY: number
  phaseA: number
  phaseB: number
  phaseC: number
  orbitPhase: number
  crossPhase: number
  detailPhase: number
  tangentialPhaseA: number
  tangentialPhaseB: number
  amplitudeBias: number
  stretchBias: number
  shearBias: number
  orbitBias: number
  detailBias: number
}

export interface PulseNodeBinding {
  clusterIndex: number
  nodeIndex: number
  phase: number
  rate: number
  weight: number
}

export interface ClusterRuntimeState {
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
  fieldX0: number
  fieldY0: number
  viewportDriftX0: number
  viewportDriftY0: number
  localDriftX0: number
  localDriftY0: number
}

export interface MutableClusterTransform {
  centerX: number
  centerY: number
  scaleX: number
  scaleY: number
  rotation: number
}

export interface MutableNodeOffset {
  x: number
  y: number
}

export interface LayerGeometry extends FlattenedLayerGeometry {
  clusters: ClusterRuntimeState[]
  pulseBindings: PulseNodeBinding[]
}

export interface NodePair {
  a: number
  b: number
  distance: number
}

export interface EdgeBuildContext {
  nodes: { id: number; x: number; y: number }[]
  edges: NetworkEdge[]
  edgeKeys: Set<string>
  connectionsPerNode: number[]
  allPairs: NodePair[]
  densityBiases: number[]
  maxDistance: number
  baseConnectionLimit: number
  weaveBoost: number
}

export interface EdgeSelectionPass {
  maxDistanceScale: number
  threshold: number
  maxEdges: number
  minSharedNeighbors: number
  connectionLimit: number
  sharedWeight: number
  densityWeight: number
  compactnessWeight: number
}
