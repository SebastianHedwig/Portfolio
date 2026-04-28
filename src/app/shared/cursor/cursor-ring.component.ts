import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'label',
  '[role="button"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

@Component({
  selector: 'app-cursor-ring',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './cursor-ring.component.html',
  styleUrl: './cursor-ring.component.scss',
})
export class CursorRingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ring', { static: true })
  private readonly ringRef!: ElementRef<HTMLElement>;

  private readonly ngZone = inject(NgZone);
  private clickTimer = 0;
  private isEnabled = false;

  ngAfterViewInit(): void {
    this.isEnabled = this.canUseCursorRing();
    if (!this.isEnabled) return;
    this.ngZone.runOutsideAngular(() => this.bindEvents());
  }

  ngOnDestroy(): void {
    if (!this.isEnabled) return;
    this.unbindEvents();
    window.clearTimeout(this.clickTimer);
  }

  private bindEvents(): void {
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', this.handlePointerDown, { passive: true });
    window.addEventListener('pointerleave', this.handlePointerLeave, { passive: true });
  }

  private unbindEvents(): void {
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointerleave', this.handlePointerLeave);
  }

  private readonly handlePointerMove = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse') return;
    const ring = this.ringRef.nativeElement;
    ring.style.transform = this.createTransform(event);
    ring.classList.add('cursor-ring--visible');
    ring.classList.toggle('cursor-ring--interactive', this.isInteractive(event));
  };

  private readonly handlePointerDown = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse') return;
    const ring = this.ringRef.nativeElement;
    ring.classList.remove('cursor-ring--clicking');
    void ring.offsetWidth;
    ring.classList.add('cursor-ring--clicking');
    window.clearTimeout(this.clickTimer);
    this.clickTimer = window.setTimeout(() => {
      ring.classList.remove('cursor-ring--clicking');
    }, 280);
  };

  private readonly handlePointerLeave = (): void => {
    this.ringRef.nativeElement.classList.remove('cursor-ring--visible');
  };

  private canUseCursorRing(): boolean {
    return window.matchMedia('(pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private createTransform(event: PointerEvent): string {
    const scale = this.isInteractive(event) ? 1.42 : 1;
    return `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%) scale(${scale})`;
  }

  private isInteractive(event: PointerEvent): boolean {
    return event.target instanceof Element
      && Boolean(event.target.closest(INTERACTIVE_SELECTOR));
  }
}
