import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SecondaryButtonComponent } from '../../shared/components/secondary-button/secondary-button.component';
import { LanguageStore } from '../../i18n/language.store';
import { getImprintContent } from './imprint.data';

@Component({
  selector: 'app-imprint',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SecondaryButtonComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
})
export class ImprintComponent {
  private readonly languageStore = inject(LanguageStore);

  readonly content = computed(() => getImprintContent(this.languageStore.language()));

  closePage(): void {
    window.close();

    window.setTimeout(() => {
      window.location.href = this.languageStore.buildLocalizedPath(
        this.languageStore.language(),
      );
    }, 120);
  }
}
