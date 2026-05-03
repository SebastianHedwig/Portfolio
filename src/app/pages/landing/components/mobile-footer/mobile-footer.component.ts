import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { LanguageStore } from '../../../../i18n/language.store';
import { LocalizedAnchorNavigationService } from '../../../../shared/navigation/localized-anchor-navigation.service';
import { getLandingFooterContent } from '../../data/landing-footer.data';

@Component({
  selector: 'app-mobile-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './mobile-footer.component.html',
  styleUrl: './mobile-footer.component.scss',
})
export class MobileFooterComponent {
  private readonly languageStore = inject(LanguageStore);
  readonly anchorNavigation = inject(LocalizedAnchorNavigationService);

  readonly footer = computed(() => getLandingFooterContent(this.languageStore.language()));
  readonly imprintHref = computed(() =>
    this.languageStore.buildLocalizedPath(
      this.languageStore.language(),
      this.footer().imprintPath,
    ),
  );
}
