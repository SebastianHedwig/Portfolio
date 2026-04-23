import { Injectable, signal } from '@angular/core';

import {
  type AppLanguage,
  DEFAULT_APP_LANGUAGE,
  isAppLanguage,
} from './language.model';

const LANGUAGE_STORAGE_KEY = 'portfolio-language';

@Injectable({ providedIn: 'root' })
export class LanguageStore {
  readonly language = signal<AppLanguage>(DEFAULT_APP_LANGUAGE);

  setLanguage(language: AppLanguage): void {
    this.language.set(language);
    this.persistLanguage(language);
  }

  resolveInitialLanguage(): AppLanguage {
    const storedLanguage = this.readStoredLanguage();

    if (storedLanguage) {
      return storedLanguage;
    }

    const browserLanguage = this.readBrowserLanguage();

    return browserLanguage ?? DEFAULT_APP_LANGUAGE;
  }

  buildLocalizedPath(
    language: AppLanguage,
    path = '',
    fragment = '',
  ): string {
    const normalizedPath = path.replace(/^\/+/, '');
    const pathname = normalizedPath ? `/${language}/${normalizedPath}` : `/${language}`;
    const normalizedFragment = fragment
      ? `#${fragment.replace(/^#/, '')}`
      : '';

    return `${pathname}${normalizedFragment}`;
  }

  switchLanguageInPath(currentPath: string, nextLanguage: AppLanguage): string {
    const normalizedPath = currentPath.replace(/^\/+/, '');

    if (!normalizedPath) {
      return `/${nextLanguage}`;
    }

    if (/^(de|en)(?=\/|$)/.test(normalizedPath)) {
      return `/${normalizedPath.replace(/^(de|en)(?=\/|$)/, nextLanguage)}`;
    }

    return `/${nextLanguage}/${normalizedPath}`;
  }

  private persistLanguage(language: AppLanguage): void {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage access failures and continue with in-memory state.
    }
  }

  private readStoredLanguage(): AppLanguage | null {
    try {
      const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return isAppLanguage(storedLanguage) ? storedLanguage : null;
    } catch {
      return null;
    }
  }

  private readBrowserLanguage(): AppLanguage | null {
    if (typeof navigator === 'undefined') {
      return null;
    }

    const [primaryLanguage = ''] = navigator.language.toLowerCase().split('-', 1);

    if (isAppLanguage(primaryLanguage)) {
      return primaryLanguage;
    }

    return null;
  }
}
