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
    const landingPath = this.normalizePath(
      this.languageStore.buildLocalizedPath(this.languageStore.language()),
    );
    const currentPath = this.normalizePath(window.location.pathname);

    if (currentPath !== landingPath) {
      await this.router.navigateByUrl(
        this.languageStore.buildLocalizedPath(
          this.languageStore.language(),
          '',
          fragment,
        ),
      );
      this.scrollToFragment(fragment, false);
      return;
    }

    this.scrollToFragment(fragment, true);
  }

  private scrollToFragment(fragment: string, pushHistory: boolean): void {
    const updateHistory = () => {
      const nextUrl = `${this.normalizePath(window.location.pathname)}#${fragment}`;

      if (pushHistory) {
        window.history.pushState(null, '', nextUrl);
        return;
      }

      window.history.replaceState(null, '', nextUrl);
    };

    const tryScroll = (attemptsRemaining: number): void => {
      const target = document.getElementById(fragment);

      if (target) {
        target.scrollIntoView({ block: 'start', behavior: 'auto' });
        updateHistory();
        return;
      }

      if (attemptsRemaining <= 0) {
        updateHistory();
        return;
      }

      requestAnimationFrame(() => tryScroll(attemptsRemaining - 1));
    };

    tryScroll(3);
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
