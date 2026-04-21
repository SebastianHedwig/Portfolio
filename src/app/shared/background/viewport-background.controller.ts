import * as THREE from 'three'

import { createPhaseTwoLayers } from './viewport-background.config'
import { PolygonNetworkLayer } from './viewport-background.network'
import { BackgroundViewport } from './viewport-background.models'

export class ViewportBackgroundController {
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.OrthographicCamera()
  private currentLayers: PolygonNetworkLayer[] = []
  private animationFrameId = 0
  private lastFrameTime = 0

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })

    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setPixelRatio(1)
  }

  start(): void {
    this.resize()
    this.stop()
    this.lastFrameTime = performance.now()

    const loop = (now: number) => {
      const deltaMs = now - this.lastFrameTime
      this.lastFrameTime = now

      for (const layer of this.currentLayers) {
        layer.update(deltaMs, now)
      }

      this.renderer.render(this.scene, this.camera)
      this.animationFrameId = window.requestAnimationFrame(loop)
    }

    loop(this.lastFrameTime)
  }

  resize(): void {
    const viewport = this.readViewport()

    this.renderer.setPixelRatio(viewport.dpr)
    this.renderer.setSize(viewport.width, viewport.height, false)
    this.camera.left = viewport.width / -2
    this.camera.right = viewport.width / 2
    this.camera.top = viewport.height / 2
    this.camera.bottom = viewport.height / -2
    this.camera.near = -10
    this.camera.far = 10
    this.camera.position.z = 1
    this.camera.updateProjectionMatrix()

    this.replaceLayers(viewport)
    this.lastFrameTime = performance.now()
    this.renderer.render(this.scene, this.camera)
  }

  stop(): void {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = 0
    }
  }

  destroy(): void {
    this.stop()
    this.clearLayers()

    this.renderer.dispose()
  }

  private replaceLayers(viewport: BackgroundViewport): void {
    this.clearLayers()

    this.currentLayers = createPhaseTwoLayers(viewport).map((definition) => {
      const layer = new PolygonNetworkLayer(definition, viewport)
      this.scene.add(layer.object3D)
      return layer
    })
  }

  private clearLayers(): void {
    for (const layer of this.currentLayers) {
      this.scene.remove(layer.object3D)
      layer.dispose()
    }

    this.currentLayers = []
  }

  private readViewport(): BackgroundViewport {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      minDimension: Math.min(window.innerWidth, window.innerHeight),
    }
  }
}
