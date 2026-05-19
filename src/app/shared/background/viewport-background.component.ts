import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

import type { ViewportBackgroundController } from './viewport-background.controller'

@Component({
  selector: 'app-viewport-background',
  standalone: true,
  template: `
    <div class="viewport-background">
      <canvas #canvas class="viewport-background__canvas" aria-hidden="true"></canvas>
    </div>
  `,
  styleUrl: './viewport-background.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewportBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private readonly canvasRef!: ElementRef<HTMLCanvasElement>

  private readonly ngZone = inject(NgZone)
  private readonly platformId = inject(PLATFORM_ID)
  private controller: ViewportBackgroundController | null = null
  private initFrameId = 0
  private isDestroyed = false
  private readonly handleResize = () => {
    this.controller?.resize()
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser()) {
      return
    }

    this.isDestroyed = false
    this.ngZone.runOutsideAngular(() => {
      this.initFrameId = window.requestAnimationFrame(() => {
        this.initFrameId = 0
        void this.createController()
      })
    })
  }

  ngOnDestroy(): void {
    this.isDestroyed = true
    if (!this.isBrowser()) {
      return
    }

    if (this.initFrameId) {
      window.cancelAnimationFrame(this.initFrameId)
      this.initFrameId = 0
    }
    window.removeEventListener('resize', this.handleResize)
    this.controller?.destroy()
    this.controller = null
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId)
  }

  private async createController(): Promise<void> {
    const Controller = await this.loadController()

    if (this.isDestroyed) {
      return
    }

    this.controller = new Controller(this.canvasRef.nativeElement)
    this.controller.start()
    window.addEventListener('resize', this.handleResize, { passive: true })
  }

  private async loadController(): Promise<typeof ViewportBackgroundController> {
    const { ViewportBackgroundController } = await import(
      './viewport-background.controller'
    )
    return ViewportBackgroundController
  }
}
