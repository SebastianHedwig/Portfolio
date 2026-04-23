import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SecondaryButtonComponent } from '../../shared/components/secondary-button/secondary-button.component';
import { LanguageStore } from '../../i18n/language.store';
import { getPrivacyContent } from './privacy.data';

@Component({
  selector: 'app-privacy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SecondaryButtonComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent {
  private readonly languageStore = inject(LanguageStore);

  readonly content = computed(() => getPrivacyContent(this.languageStore.language()));

  closePage(): void {
    window.close();

    window.setTimeout(() => {
      window.location.href = this.languageStore.buildLocalizedPath(
        this.languageStore.language(),
      );
    }, 120);
  }
}
