import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Location } from '@angular/common';

import { type AppLanguage } from '../../../../i18n/language.model';
import { LanguageStore } from '../../../../i18n/language.store';
import { LocalizedAnchorNavigationService } from '../../../../shared/navigation/localized-anchor-navigation.service';
import { getLandingHeaderContent } from '../../data/landing-header.data';

const HEADER_IDLE_REVEAL_DELAY_MS = 2000;
const HEADER_TOP_REVEAL_SCROLL_Y_PX = 24;
const HEADER_LANGUAGE_SWITCH_LOCK_MS = 260;
const MOBILE_MENU_CLOSE_MS = 260;

@Component({
  selector: 'app-mobile-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.scss',
})
export class MobileHeaderComponent implements OnDestroy {
  readonly header = viewChild.required<ElementRef<HTMLElement>>('header');
  readonly isHidden = signal(false);
  readonly isLanguageSwitching = signal(false);
  readonly isMobileMenuOpen = signal(false);
  readonly isMobileMenuClosing = signal(false);

  private readonly languageStore = inject(LanguageStore);
  private readonly location = inject(Location);
  readonly anchorNavigation = inject(LocalizedAnchorNavigationService);
  readonly content = computed(() => getLandingHeaderContent(this.languageStore.language()));
  readonly brand = computed(() => this.content().brand);
  readonly navItems = computed(() => this.content().navItems);
  readonly activeLanguage = this.languageStore.language;
  private cleanupCallbacks: Array<() => void> = [];
  private idleRevealTimer: ReturnType<typeof setTimeout> | null = null;
  private mobileMenuCloseTimer: ReturnType<typeof setTimeout> | null = null;
  private hasInitializedLanguage = false;
  private suppressInteractionsUntil = 0;

  constructor() {
    afterNextRender(() => this.initEventListeners());
    effect((onCleanup) => {
      this.activeLanguage();

      if (!this.hasInitializedLanguage) {
        this.hasInitializedLanguage = true;
        return;
      }

      this.clearIdleRevealTimer();
      this.isLanguageSwitching.set(true);
      this.suppressInteractionsUntil = performance.now() + HEADER_LANGUAGE_SWITCH_LOCK_MS;

      const unlockTimer = window.setTimeout(() => {
        this.isLanguageSwitching.set(false);
      }, HEADER_LANGUAGE_SWITCH_LOCK_MS);

      onCleanup(() => {
        clearTimeout(unlockTimer);
        this.isLanguageSwitching.set(false);
      });
    });
  }

  ngOnDestroy(): void {
    this.clearIdleRevealTimer();
    this.clearMobileMenuCloseTimer();
    this.cleanupEventListeners();
  }

  switchLanguage(nextLanguage: AppLanguage): void {
    if (nextLanguage === this.activeLanguage()) {
      return;
    }

    this.languageStore.setLanguage(nextLanguage);

    const nextPath = this.languageStore.switchLanguageInPath(
      window.location.pathname,
      nextLanguage,
    );
    const fragment = window.location.hash;

    this.location.replaceState(`${nextPath}${fragment}`);
  }

  toggleMobileMenu(): void {
    this.clearMobileMenuCloseTimer();
    this.isMobileMenuClosing.set(false);
    this.isMobileMenuOpen.update((isOpen) => !isOpen);
    this.revealHeader();
  }

  closeMobileMenu(): void {
    if (!this.isMobileMenuOpen()) {
      return;
    }

    this.isMobileMenuOpen.set(false);
    this.isMobileMenuClosing.set(true);

    this.clearMobileMenuCloseTimer();
    this.mobileMenuCloseTimer = window.setTimeout(() => {
      this.isMobileMenuClosing.set(false);
      this.mobileMenuCloseTimer = null;
    }, MOBILE_MENU_CLOSE_MS);
  }

  navigateFromMobileMenu(event: MouseEvent, fragmentHref: string): void {
    this.closeMobileMenu();
    this.anchorNavigation.handleClick(event, fragmentHref);
  }

  private initEventListeners(): void {
    this.cleanupCallbacks = [
      this.bindWindowEvent('scroll', () => this.handleScroll(), { passive: true }),
      this.bindWindowEvent('mousemove', (event) => this.handleMouseMove(event), { passive: true }),
      this.bindWindowEvent('keydown', (event) => this.handleKeydown(event)),
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
    if (this.isMobileMenuOpen()) {
      this.revealHeader();
      return;
    }

    if (this.isInteractionLocked()) {
      return;
    }

    if (this.isAtHeroTop()) {
      this.clearIdleRevealTimer();
      this.revealHeader();
      return;
    }

    this.hideHeader();
    this.scheduleIdleReveal();
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMobileMenu();
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.isInteractionLocked()) {
      return;
    }

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

  private clearMobileMenuCloseTimer(): void {
    if (this.mobileMenuCloseTimer === null) return;
    clearTimeout(this.mobileMenuCloseTimer);
    this.mobileMenuCloseTimer = null;
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

  private isInteractionLocked(): boolean {
    return performance.now() < this.suppressInteractionsUntil;
  }
}
