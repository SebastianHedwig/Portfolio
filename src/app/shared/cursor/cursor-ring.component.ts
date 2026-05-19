import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'select',
  '[role="button"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const TEXT_INPUT_SELECTOR = [
  'textarea',
  '[contenteditable=""]',
  '[contenteditable="true"]',
  'input:not([type])',
  'input[type="email"]',
  'input[type="number"]',
  'input[type="password"]',
  'input[type="search"]',
  'input[type="tel"]',
  'input[type="text"]',
  'input[type="url"]',
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
  private readonly platformId = inject(PLATFORM_ID);
  private clickTimer = 0;
  private isEnabled = false;

  ngAfterViewInit(): void {
    if (!this.isBrowser()) return;
    this.isEnabled = this.canUseCursorRing();
    if (!this.isEnabled) return;
    this.ngZone.runOutsideAngular(() => this.bindEvents());
  }

  ngOnDestroy(): void {
    if (!this.isBrowser()) return;
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
    const target = this.getEventTarget(event);

    if (this.isTextInputTarget(target)) {
      ring.classList.remove('cursor-ring--visible', 'cursor-ring--interactive');
      return;
    }

    ring.style.transform = this.createTransform(event, target);
    ring.classList.add('cursor-ring--visible');
    ring.classList.toggle('cursor-ring--interactive', this.isInteractiveTarget(target));
  };

  private readonly handlePointerDown = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse') return;
    if (this.isTextInputTarget(this.getEventTarget(event))) return;
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

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private createTransform(event: PointerEvent, target: Element | null): string {
    const scale = this.isInteractiveTarget(target) ? 1.42 : 1;
    return `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%) scale(${scale})`;
  }

  private getEventTarget(event: PointerEvent): Element | null {
    return event.target instanceof Element ? event.target : null;
  }

  private isInteractiveTarget(target: Element | null): boolean {
    if (!target) return false;
    if (target.closest(INTERACTIVE_SELECTOR)) return true;

    const label = target.closest('label');
    return Boolean(label && !label.querySelector(TEXT_INPUT_SELECTOR));
  }

  private isTextInputTarget(target: Element | null): boolean {
    return Boolean(target?.closest(TEXT_INPUT_SELECTOR));
  }
}
