export interface BackgroundViewport {
  width: number
  height: number
  dpr: number
  minDimension: number
}

export interface NetworkNodeSeed {
  id: number
  x: number
  y: number
}

export interface NetworkEdge {
  a: number
  b: number
}

export interface NetworkClusterDefinition {
  anchorX: number
  anchorY: number
  radius: number
  aspect: number
  nodeCount: number
  seed: number
}

export interface NetworkLayerDefinition {
  id: string
  lineColor: string
  pointColor: string
  lineOpacity: number
  pointOpacity: number
  pointSize: number
  edgeDistanceFactor: number
  maxNeighborsPerNode: number
  pulseNodeCount: number
  pulseOpacity: number
  pulseSizeScale: number
  pulseSpeed: number
  zOffset: number
  renderOrder: number
  motion: NetworkLayerMotionDefinition
  clusters: NetworkClusterDefinition[]
}

export interface NetworkLayerMotionDefinition {
  clusterOffsetRange: number
  viewportDriftRange: number
  scaleRange: number
  rotationRange: number
  nodeOffsetRange: number
  driftSpeed: number
  morphSpeed: number
  sweepSpeed: number
  deformationSpeed: number
  detailMix: number
}
