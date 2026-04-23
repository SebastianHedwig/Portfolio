import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { HeroDescriptionComponent } from './components/hero-description/hero-description.component';
import { HeroIdentityComponent } from './components/hero-identity/hero-identity.component';
import { HeroPortraitComponent } from './components/hero-portrait/hero-portrait.component';
import { LanguageStore } from '../../i18n/language.store';
import { getHeroContent } from './hero.data';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    HeroDescriptionComponent,
    HeroIdentityComponent,
    HeroPortraitComponent,
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  private readonly languageStore = inject(LanguageStore);

  readonly content = computed(() => getHeroContent(this.languageStore.language()));
  readonly description = computed(() => this.content().description);
  readonly identity = computed(() => this.content().identity);
  readonly portrait = computed(() => this.content().portrait);
  readonly statementParts = computed(() => this.content().statementParts);
  readonly statementRepeats = Array.from({ length: 4 }, (_, index) => index);
}
