import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  signal,
  viewChild,
} from '@angular/core';
import {
  DESKTOP_HEADER_BRAND,
  DESKTOP_HEADER_NAV_ITEMS,
} from './desktop-header.data';

const HEADER_IDLE_REVEAL_DELAY_MS = 2000;
const HEADER_TOP_REVEAL_SCROLL_Y_PX = 24;

@Component({
  selector: 'app-desktop-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './desktop-header.component.html',
  styleUrl: './desktop-header.component.scss',
})
export class DesktopHeaderComponent implements OnDestroy {
  readonly header = viewChild.required<ElementRef<HTMLElement>>('header');
  readonly brand = DESKTOP_HEADER_BRAND;
  readonly navItems = DESKTOP_HEADER_NAV_ITEMS;
  readonly isHidden = signal(false);

  private cleanupCallbacks: Array<() => void> = [];
  private idleRevealTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => this.initEventListeners());
  }

  ngOnDestroy(): void {
    this.clearIdleRevealTimer();
    this.cleanupEventListeners();
  }

  private initEventListeners(): void {
    this.cleanupCallbacks = [
      this.bindWindowEvent('scroll', () => this.handleScroll(), { passive: true }),
      this.bindWindowEvent('mousemove', (event) => this.handleMouseMove(event), { passive: true }),
    ];
  }

  private bindWindowEvent<K extends keyof WindowEventMap>(
    type: K,
    listener: (event: WindowEventMap[K]) => void,
    options?: AddEventListenerOptions,
  ): () => void {
    window.addEventListener(type, listener as EventListener, options);
    return () => window.removeEventListener(type, listener as EventListener, options);
  }

  private handleScroll(): void {
    if (this.isAtHeroTop()) {
      this.clearIdleRevealTimer();
      this.revealHeader();
      return;
    }

    this.hideHeader();
    this.scheduleIdleReveal();
  }

  private handleMouseMove(event: MouseEvent): void {
    if (!this.shouldRevealFromPointer(event.clientY) || !this.isHidden()) return;

    this.clearIdleRevealTimer();
    this.revealHeader();
  }

  private shouldRevealFromPointer(pointerY: number): boolean {
    return pointerY <= this.header().nativeElement.offsetHeight;
  }

  private isAtHeroTop(): boolean {
    return window.scrollY <= HEADER_TOP_REVEAL_SCROLL_Y_PX;
  }

  private scheduleIdleReveal(): void {
    this.clearIdleRevealTimer();
    this.idleRevealTimer = window.setTimeout(() => this.revealHeader(), HEADER_IDLE_REVEAL_DELAY_MS);
  }

  private clearIdleRevealTimer(): void {
    if (this.idleRevealTimer === null) return;
    clearTimeout(this.idleRevealTimer);
    this.idleRevealTimer = null;
  }

  private hideHeader(): void {
    this.isHidden.set(true);
  }

  private revealHeader(): void {
    this.isHidden.set(false);
    this.idleRevealTimer = null;
  }

  private cleanupEventListeners(): void {
    this.cleanupCallbacks.forEach((cleanup) => cleanup());
    this.cleanupCallbacks = [];
  }
}
