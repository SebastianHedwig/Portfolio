import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core'

import { ViewportBackgroundController } from './viewport-background.controller'

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
  private controller: ViewportBackgroundController | null = null
  private readonly handleResize = () => {
    this.controller?.resize()
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.controller = new ViewportBackgroundController(
        this.canvasRef.nativeElement,
      )
      this.controller.start()
      window.addEventListener('resize', this.handleResize, { passive: true })
    })
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize)
    this.controller?.destroy()
    this.controller = null
  }
}
