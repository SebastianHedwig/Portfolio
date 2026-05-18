import { OrthographicCamera, Scene, WebGLRenderer } from 'three'

import { createPhaseTwoLayers } from './viewport-background.config'
import { PolygonNetworkLayer } from './viewport-background.network'
import { BackgroundViewport } from './viewport-background.models'

const BACKGROUND_TARGET_FPS = 45
const BACKGROUND_FRAME_INTERVAL_MS = 1000 / BACKGROUND_TARGET_FPS

export class ViewportBackgroundController {
  private readonly renderer: WebGLRenderer
  private readonly scene = new Scene()
  private readonly camera = new OrthographicCamera()
  private currentLayers: PolygonNetworkLayer[] = []
  private animationFrameId = 0
  private lastFrameTime = 0
  private lastFrameGateTime = 0
  private readonly animate = (now: number): void => {
    if (!this.shouldRenderFrame(now)) {
      this.requestNextFrame()
      return
    }

    this.renderFrame(now)
    this.requestNextFrame()
  }

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })

    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setPixelRatio(1)
  }

  start(): void {
    this.stop()
    this.resize()
    this.resetFrameTiming()
    this.requestNextFrame()
  }

  resize(): void {
    const viewport = this.readViewport()

    this.renderer.setPixelRatio(viewport.dpr)
    this.renderer.setSize(viewport.width, viewport.height, false)
    this.configureCamera(viewport)
    this.replaceLayers(viewport)
    this.resetFrameTiming()
    this.renderer.render(this.scene, this.camera)
  }

  private shouldRenderFrame(now: number): boolean {
    return now - this.lastFrameGateTime >= BACKGROUND_FRAME_INTERVAL_MS
  }

  private renderFrame(now: number): void {
    const deltaMs = now - this.lastFrameTime
    this.lastFrameTime = now
    this.updateFrameGateTime(now)
    this.updateLayers(deltaMs, now)
    this.renderer.render(this.scene, this.camera)
  }

  private updateFrameGateTime(now: number): void {
    const elapsedSinceLastGate = now - this.lastFrameGateTime
    this.lastFrameGateTime = now
      - (elapsedSinceLastGate % BACKGROUND_FRAME_INTERVAL_MS)
  }

  private updateLayers(deltaMs: number, now: number): void {
    for (const layer of this.currentLayers) {
      layer.update(deltaMs, now)
    }
  }

  private requestNextFrame(): void {
    this.animationFrameId = window.requestAnimationFrame(this.animate)
  }

  private configureCamera(viewport: BackgroundViewport): void {
    this.camera.left = viewport.width / -2
    this.camera.right = viewport.width / 2
    this.camera.top = viewport.height / 2
    this.camera.bottom = viewport.height / -2
    this.camera.near = -10
    this.camera.far = 10
    this.camera.position.z = 1
    this.camera.updateProjectionMatrix()
  }

  private resetFrameTiming(): void {
    const now = performance.now()
    this.lastFrameTime = now
    this.lastFrameGateTime = now
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
