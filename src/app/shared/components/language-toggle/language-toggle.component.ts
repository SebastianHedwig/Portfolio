import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';

import { type AppLanguage } from '../../../i18n/language.model';
import { LanguageStore } from '../../../i18n/language.store';

@Component({
  selector: 'app-language-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './language-toggle.component.html',
  styleUrl: './language-toggle.component.scss',
})
export class LanguageToggleComponent {
  private readonly languageStore = inject(LanguageStore);
  private readonly location = inject(Location);

  readonly ariaLabel = input('Sprache wechseln');
  readonly titleLabel = input('Sprache wechseln');
  readonly activeLanguage = this.languageStore.language;

  switchLanguage(nextLanguage: AppLanguage): void {
    if (nextLanguage === this.activeLanguage()) {
      return;
    }

    this.languageStore.setLanguage(nextLanguage);
    this.location.replaceState(this.createLanguagePath(nextLanguage));
  }

  private createLanguagePath(nextLanguage: AppLanguage): string {
    const nextPath = this.languageStore.switchLanguageInPath(
      window.location.pathname,
      nextLanguage,
    );
    const fragment = window.location.hash;
    return `${nextPath}${fragment}`;
  }
}
