import {
  BackgroundViewport,
  NetworkLayerDefinition,
  NetworkLayerMotionDefinition,
} from './viewport-background.models'

type NetworkClusterTemplate = Omit<
  NetworkLayerDefinition['clusters'][number],
  'radius'
> & {
  radiusScale: number
}

type NetworkLayerTemplate = Omit<
  NetworkLayerDefinition,
  'clusters' | 'pointSize'
> & {
  clusters: NetworkClusterTemplate[]
  pointSize: { max: number; min: number; scale: number }
}

const DEEP_MOTION: NetworkLayerMotionDefinition = {
  clusterOffsetRange: 0.082,
  viewportDriftRange: 0.16,
  scaleRange: 0.02,
  rotationRange: 0.012,
  nodeOffsetRange: 0.14,
  driftSpeed: 0.06,
  morphSpeed: 0.11,
  sweepSpeed: 0.07,
  deformationSpeed: 0.34,
  detailMix: 0.1,
}

const ACTIVE_MOTION: NetworkLayerMotionDefinition = {
  clusterOffsetRange: 0.088,
  viewportDriftRange: 0.14,
  scaleRange: 0.024,
  rotationRange: 0.016,
  nodeOffsetRange: 0.18,
  driftSpeed: 0.09,
  morphSpeed: 0.14,
  sweepSpeed: 0.09,
  deformationSpeed: 0.46,
  detailMix: 0.14,
}

const DEEP_CLUSTERS: NetworkClusterTemplate[] = [
  { anchorX: -0.84, anchorY: 0.56, radiusScale: 0.26, aspect: 1.36, nodeCount: 17, seed: 101 },
  { anchorX: -0.24, anchorY: 0.68, radiusScale: 0.24, aspect: 1.24, nodeCount: 16, seed: 223 },
  { anchorX: 0.42, anchorY: 0.62, radiusScale: 0.25, aspect: 1.28, nodeCount: 17, seed: 811 },
  { anchorX: 0.86, anchorY: 0.18, radiusScale: 0.22, aspect: 1.18, nodeCount: 15, seed: 919 },
  { anchorX: 0.66, anchorY: -0.34, radiusScale: 0.25, aspect: 1.22, nodeCount: 17, seed: 1237 },
  { anchorX: 0.08, anchorY: -0.54, radiusScale: 0.28, aspect: 1.26, nodeCount: 18, seed: 1439 },
  { anchorX: -0.52, anchorY: -0.46, radiusScale: 0.26, aspect: 1.34, nodeCount: 17, seed: 1543 },
  { anchorX: -0.86, anchorY: -0.02, radiusScale: 0.22, aspect: 1.18, nodeCount: 15, seed: 1657 },
  { anchorX: 0.14, anchorY: 0.08, radiusScale: 0.3, aspect: 1.42, nodeCount: 19, seed: 1777 },
  { anchorX: -0.58, anchorY: 0.08, radiusScale: 0.23, aspect: 1.2, nodeCount: 16, seed: 1879 },
  { anchorX: 0.84, anchorY: -0.74, radiusScale: 0.2, aspect: 1.16, nodeCount: 14, seed: 1999 },
]

const ACTIVE_CLUSTERS: NetworkClusterTemplate[] = [
  { anchorX: -0.68, anchorY: 0.76, radiusScale: 0.17, aspect: 1.22, nodeCount: 13, seed: 307 },
  { anchorX: -0.06, anchorY: 0.52, radiusScale: 0.19, aspect: 1.32, nodeCount: 15, seed: 509 },
  { anchorX: 0.58, anchorY: 0.7, radiusScale: 0.17, aspect: 1.18, nodeCount: 13, seed: 701 },
  { anchorX: 0.82, anchorY: 0.08, radiusScale: 0.16, aspect: 1.16, nodeCount: 12, seed: 1031 },
  { anchorX: 0.74, anchorY: -0.54, radiusScale: 0.18, aspect: 1.2, nodeCount: 13, seed: 1291 },
  { anchorX: 0.08, anchorY: -0.76, radiusScale: 0.18, aspect: 1.22, nodeCount: 14, seed: 1409 },
  { anchorX: -0.46, anchorY: -0.62, radiusScale: 0.19, aspect: 1.28, nodeCount: 15, seed: 1523 },
  { anchorX: -0.82, anchorY: -0.16, radiusScale: 0.16, aspect: 1.18, nodeCount: 12, seed: 1627 },
  { anchorX: -0.4, anchorY: 0.04, radiusScale: 0.2, aspect: 1.3, nodeCount: 15, seed: 1741 },
  { anchorX: -0.22, anchorY: -0.08, radiusScale: 0.16, aspect: 1.24, nodeCount: 13, seed: 1867 },
  { anchorX: 0.46, anchorY: 0.18, radiusScale: 0.17, aspect: 1.2, nodeCount: 13, seed: 2017 },
]

const LAYER_TEMPLATES: NetworkLayerTemplate[] = [
  {
    id: 'deep-structure',
    lineColor: '#6ca8cc',
    pointColor: '#7eaecb',
    lineOpacity: 0.065,
    pointOpacity: 0.09,
    pointSize: { scale: 0.00255, min: 1.75, max: 2.95 },
    edgeDistanceFactor: 1.12,
    maxNeighborsPerNode: 4,
    pulseNodeCount: 2,
    pulseOpacity: 0.2,
    pulseSizeScale: 1.82,
    pulseSpeed: 0.72,
    zOffset: -0.2,
    renderOrder: 0,
    motion: DEEP_MOTION,
    clusters: DEEP_CLUSTERS,
  },
  {
    id: 'active-structure',
    lineColor: '#82c1e6',
    pointColor: '#a6d6ee',
    lineOpacity: 0.125,
    pointOpacity: 0.165,
    pointSize: { scale: 0.003, min: 2.15, max: 3.45 },
    edgeDistanceFactor: 1.04,
    maxNeighborsPerNode: 5,
    pulseNodeCount: 3,
    pulseOpacity: 0.255,
    pulseSizeScale: 2.05,
    pulseSpeed: 1.12,
    zOffset: 0,
    renderOrder: 1,
    motion: ACTIVE_MOTION,
    clusters: ACTIVE_CLUSTERS,
  },
]

export function createPhaseTwoLayers(
  viewport: BackgroundViewport,
): NetworkLayerDefinition[] {
  return LAYER_TEMPLATES.map((template) =>
    createLayerDefinition(template, viewport.minDimension, viewport),
  )
}

function createLayerDefinition(
  template: NetworkLayerTemplate,
  scale: number,
  viewport: BackgroundViewport,
): NetworkLayerDefinition {
  const { pointSize, clusters, ...definition } = template
  const mobileOpacityScale = getMobileOpacityScale(viewport)

  return {
    ...definition,
    lineOpacity: clamp(definition.lineOpacity * mobileOpacityScale.line, 0, 0.18),
    pointOpacity: clamp(definition.pointOpacity * mobileOpacityScale.point, 0, 0.24),
    pulseOpacity: clamp(definition.pulseOpacity * mobileOpacityScale.pulse, 0, 0.34),
    pointSize: clamp(scale * pointSize.scale, pointSize.min, pointSize.max),
    clusters: clusters.map((cluster) => scaleCluster(cluster, scale)),
  }
}


function getMobileOpacityScale(
  viewport: BackgroundViewport,
): { line: number; point: number; pulse: number } {
  const isMobilePortrait = viewport.width <= 760 && viewport.height > viewport.width

  if (!isMobilePortrait) {
    return { line: 1, point: 1, pulse: 1 }
  }

  return { line: 1.75, point: 1.55, pulse: 1.35 }
}

function scaleCluster(
  cluster: NetworkClusterTemplate,
  scale: number,
): NetworkLayerDefinition['clusters'][number] {
  const { radiusScale, ...definition } = cluster
  return { ...definition, radius: scale * radiusScale }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
