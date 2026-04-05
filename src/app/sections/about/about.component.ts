import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  afterNextRender,
  computed,
  signal,
  viewChild,
} from '@angular/core';

import {
  ABOUT_CONTEXT_CENTER,
  ABOUT_CONTEXT_LEFT,
  ABOUT_CONTEXT_RIGHT,
  ABOUT_INTRO_LEAD,
  ABOUT_INTRO_SECONDARY,
  ABOUT_PORTRAIT,
} from './about.data';
import { type AboutStageVisualState } from './about.models';
import { AboutImageComponent } from './components/about-image/about-image.component';
import { AboutTextBlockComponent } from './components/about-text-block/about-text-block.component';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AboutImageComponent, AboutTextBlockComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnDestroy {
  readonly scrollSpace = viewChild.required<ElementRef<HTMLElement>>('scrollSpace');
  readonly introPause = 0.45;
  readonly contextPause = 0.4;
  readonly pauseUnits = this.introPause + this.contextPause;
  readonly sceneCount = 2 + this.pauseUnits;

  readonly portrait = ABOUT_PORTRAIT;
  readonly introLead = ABOUT_INTRO_LEAD;
  readonly introSecondary = ABOUT_INTRO_SECONDARY;
  readonly contextLeft = ABOUT_CONTEXT_LEFT;
  readonly contextCenter = ABOUT_CONTEXT_CENTER;
  readonly contextRight = ABOUT_CONTEXT_RIGHT;

  private frameId: number | null = null;
  private readonly targetProgress = signal(0);
  private readonly progress = signal(0);

  readonly introState = computed(() => this.createSceneState(0));
  readonly contextState = computed(() => this.createSceneState(1));

  constructor() {
    afterNextRender(() => this.updateTargetProgress());
  }

  ngOnDestroy(): void {
    this.stopProgressLoop();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateTargetProgress();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateTargetProgress();
  }

  private updateTargetProgress(): void {
    const rect = this.scrollSpace().nativeElement.getBoundingClientRect();
    this.targetProgress.set(this.normalizeProgress(rect));
    this.startProgressLoop();
  }

  private normalizeProgress(rect: DOMRect): number {
    const travelled = -rect.top;
    const total = this.getTotalDistance(rect);
    const clamped = this.clamp(travelled, 0, total);
    const units = (clamped / total) * this.getTotalUnits();
    return this.mapUnitsToProgress(units);
  }

  private createSceneState(anchor: number): AboutStageVisualState {
    const delta = anchor - this.progress();
    const shift = delta * -112;
    const scale = 1 - this.clamp(Math.abs(delta) * 0.08, 0, 0.16);
    const opacity = this.clamp(1 - Math.abs(delta) * 0.78, 0, 1);

    return {
      opacity: `${opacity}`,
      pointerEvents: opacity > 0.25 ? 'auto' : 'none',
      transform: `translate3d(${shift}vw, 0, 0) scale(${scale})`,
      zIndex: anchor === 1 ? '2' : '1',
    };
  }

  private mapUnitsToProgress(units: number): number {
    const raw = this.clamp(units / this.getTotalUnits(), 0, 1);
    return this.easeHold(raw);
  }

  private getTotalDistance(rect: DOMRect): number {
    return Math.max(rect.height - window.innerHeight, 1);
  }

  private getTotalUnits(): number {
    return 1 + this.pauseUnits;
  }

  private easeHold(value: number): number {
    return this.easeInOut(this.easeInOut(value));
  }

  private easeInOut(value: number): number {
    return value * value * (3 - 2 * value);
  }

  private startProgressLoop(): void {
    if (this.frameId !== null) return;
    this.queueNextTick();
  }

  private tickProgress(): void {
    const next = this.getNextProgress();
    this.progress.set(next);
    this.hasProgressSettled(next) ? this.stopProgressLoop() : this.queueNextTick();
  }

  private getNextProgress(): number {
    const current = this.progress();
    const target = this.targetProgress();
    const next = current + (target - current) * 0.14;
    return this.hasProgressSettled(next) ? target : next;
  }

  private hasProgressSettled(value: number): boolean {
    return Math.abs(this.targetProgress() - value) < 0.001;
  }

  private queueNextTick(): void {
    this.frameId = window.requestAnimationFrame(() => this.tickProgress());
  }

  private stopProgressLoop(): void {
    if (this.frameId === null) return;
    window.cancelAnimationFrame(this.frameId);
    this.frameId = null;
  }

  private clamp(value: number, min = 0, max = 1): number {
    return Math.min(max, Math.max(min, value));
  }
}
