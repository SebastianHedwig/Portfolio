import type { Group, Object3D } from 'three'

import {
  BackgroundViewport,
  NetworkLayerDefinition,
} from './viewport-background.models'
import {
  createClusterTransformScratch,
  createNodeOffsetScratch,
  writeAnimatedLayerPositions,
} from './viewport-background.network-animation'
import { buildLayerGeometry } from './viewport-background.network-geometry'
import {
  createNetworkGroup,
  createNetworkRenderResources,
  disposeNetworkResources,
  markNetworkAttributesForUpdate,
  NetworkRenderResources,
  setPulseMaterialTime,
} from './viewport-background.network-render'
import {
  ClusterRuntimeState,
  LayerGeometry,
  MutableClusterTransform,
  MutableNodeOffset,
  PulseNodeBinding,
} from './viewport-background.network-types'

export class PolygonNetworkLayer {
  private readonly group: Group
  private readonly geometry: LayerGeometry
  private readonly resources: NetworkRenderResources
  private readonly clusters: ClusterRuntimeState[]
  private readonly pulseBindings: PulseNodeBinding[]
  private readonly clusterTransform: MutableClusterTransform
  private readonly nodeOffset: MutableNodeOffset

  constructor(
    private readonly definition: NetworkLayerDefinition,
    private readonly viewport: BackgroundViewport,
  ) {
    this.geometry = buildLayerGeometry(definition, viewport)
    this.resources = createNetworkRenderResources(definition, this.geometry)
    this.group = createNetworkGroup(definition, this.resources)
    this.clusters = this.geometry.clusters
    this.pulseBindings = this.geometry.pulseBindings
    this.clusterTransform = createClusterTransformScratch()
    this.nodeOffset = createNodeOffsetScratch()
    this.syncGeometry()
  }

  get object3D(): Object3D {
    return this.group
  }

  update(_: number, nowMs: number): void {
    this.writeAnimatedPositions(nowMs)
    markNetworkAttributesForUpdate(this.resources)
    setPulseMaterialTime(this.resources, nowMs)
  }

  dispose(): void {
    disposeNetworkResources(this.group, this.resources)
  }

  private syncGeometry(): void {
    this.writeAnimatedPositions(0)
  }

  private writeAnimatedPositions(nowMs: number): void {
    writeAnimatedLayerPositions(nowMs, this.clusters, this.pulseBindings, this.animationContext)
  }

  private get animationContext() {
    return {
      definition: this.definition,
      viewport: this.viewport,
      linePositionsByTier: this.geometry.linePositionsByTier,
      pointPositionsByTier: this.geometry.pointPositionsByTier,
      pulsePositions: this.geometry.pulsePositions,
      clusterTransform: this.clusterTransform,
      nodeOffset: this.nodeOffset,
    }
  }
}
