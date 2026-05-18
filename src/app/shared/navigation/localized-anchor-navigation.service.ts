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
    void this.navigate(fragmentHref);
  }

  async navigate(fragmentHref: string): Promise<void> {
    const fragment = this.normalizeFragment(fragmentHref);

    if (!this.isOnLandingPath()) {
      await this.router.navigateByUrl(this.buildLandingFragmentPath(fragment));
      this.scrollToFragment(fragment, false);
      return;
    }

    this.scrollToFragment(fragment, true);
  }

  private scrollToFragment(fragment: string, pushHistory: boolean): void {
    this.tryScrollToFragment(fragment, pushHistory, 3);
  }

  private tryScrollToFragment(
    fragment: string,
    pushHistory: boolean,
    attemptsRemaining: number,
  ): void {
    const target = document.getElementById(fragment);

    if (target) return this.scrollTargetIntoView(target, fragment, pushHistory);
    if (attemptsRemaining <= 0) return this.updateHistory(fragment, pushHistory);

    this.retryScrollToFragment(fragment, pushHistory, attemptsRemaining);
  }

  private scrollTargetIntoView(
    target: HTMLElement,
    fragment: string,
    pushHistory: boolean,
  ): void {
    target.scrollIntoView({ block: 'start', behavior: 'auto' });
    this.updateHistory(fragment, pushHistory);
  }

  private retryScrollToFragment(
    fragment: string,
    pushHistory: boolean,
    attemptsRemaining: number,
  ): void {
    requestAnimationFrame(() =>
      this.tryScrollToFragment(fragment, pushHistory, attemptsRemaining - 1),
    );
  }

  private updateHistory(fragment: string, pushHistory: boolean): void {
    const nextUrl = `${this.normalizePath(window.location.pathname)}#${fragment}`;
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
}
