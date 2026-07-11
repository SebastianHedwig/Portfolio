import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageStore } from '../../i18n/language.store';

@Injectable({ providedIn: 'root' })
export class LocalizedAnchorNavigationService {
  private readonly languageStore = inject(LanguageStore);
  private readonly router = inject(Router);

  buildHref(fragmentHref: string): string {
    return this.languageStore.buildLocalizedPath(
      this.languageStore.language(),
      '',
      this.normalizeFragment(fragmentHref),
    );
  }

  handleClick(event: MouseEvent, fragmentHref: string): void {
    event.preventDefault();
    const shouldFocusTarget = event.detail === 0;

    if (!shouldFocusTarget && event.currentTarget instanceof HTMLElement) {
      event.currentTarget.blur();
    }

    void this.navigate(fragmentHref, shouldFocusTarget);
  }

  async navigate(fragmentHref: string, shouldFocusTarget = false): Promise<void> {
    const fragment = this.normalizeFragment(fragmentHref);

    if (!this.isOnLandingPath()) {
      await this.router.navigateByUrl(this.buildLandingFragmentPath(fragment));
      this.scrollToFragment(fragment, false, shouldFocusTarget, true);
      return;
    }

    this.scrollToFragment(fragment, true, shouldFocusTarget);
  }

  private scrollToFragment(
    fragment: string,
    pushHistory: boolean,
    shouldFocusTarget: boolean,
    stabilizeAfterRouteChange = false,
  ): void {
    this.tryScrollToFragment(fragment, pushHistory, shouldFocusTarget, 10);

    if (!stabilizeAfterRouteChange) return;

    window.setTimeout(
      () => this.tryScrollToFragment(fragment, false, shouldFocusTarget, 1),
      120,
    );
    window.setTimeout(
      () => this.tryScrollToFragment(fragment, false, shouldFocusTarget, 1),
      320,
    );
  }

  private tryScrollToFragment(
    fragment: string,
    pushHistory: boolean,
    shouldFocusTarget: boolean,
    attemptsRemaining: number,
  ): void {
    const target = document.getElementById(fragment);

    if (target) {
      return this.scrollTargetIntoView(target, fragment, pushHistory, shouldFocusTarget);
    }

    if (attemptsRemaining <= 0) return this.updateHistory(fragment, pushHistory);

    this.retryScrollToFragment(fragment, pushHistory, shouldFocusTarget, attemptsRemaining);
  }

  private scrollTargetIntoView(
    target: HTMLElement,
    fragment: string,
    pushHistory: boolean,
    shouldFocusTarget: boolean,
  ): void {
    if (fragment === 'hero') {
      return this.scrollToLandingStart(target, pushHistory, shouldFocusTarget);
    }

    target.scrollIntoView({ block: 'start', behavior: 'auto' });
    this.updateHistory(fragment, pushHistory);

    if (shouldFocusTarget) {
      target.focus({ preventScroll: true });
    }
  }

  private retryScrollToFragment(
    fragment: string,
    pushHistory: boolean,
    shouldFocusTarget: boolean,
    attemptsRemaining: number,
  ): void {
    requestAnimationFrame(() =>
      this.tryScrollToFragment(fragment, pushHistory, shouldFocusTarget, attemptsRemaining - 1),
    );
  }

  private updateHistory(fragment: string, pushHistory: boolean): void {
    const normalizedPath = this.normalizePath(window.location.pathname);
    const nextUrl = fragment === 'hero'
      ? normalizedPath
      : `${normalizedPath}#${fragment}`;

    if (pushHistory) {
      window.history.pushState(null, '', nextUrl);
      return;
    }
    window.history.replaceState(null, '', nextUrl);
  }

  private isOnLandingPath(): boolean {
    return this.normalizePath(window.location.pathname) === this.getLandingPath();
  }

  private getLandingPath(): string {
    return this.normalizePath(
      this.languageStore.buildLocalizedPath(this.languageStore.language()),
    );
  }

  private buildLandingFragmentPath(fragment: string): string {
    return this.languageStore.buildLocalizedPath(
      this.languageStore.language(),
      '',
      fragment,
    );
  }

  private normalizeFragment(fragmentHref: string): string {
    return fragmentHref.replace(/^.*#/, '');
  }

  private normalizePath(path: string): string {
    if (!path || path === '/') {
      return '/';
    }

    return path.replace(/\/+$/, '');
  }

  private scrollToLandingStart(
    target: HTMLElement,
    pushHistory: boolean,
    shouldFocusTarget: boolean,
  ): void {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    this.updateHistory('hero', pushHistory);

    if (shouldFocusTarget) {
      target.focus({ preventScroll: true });
    }
  }
}
