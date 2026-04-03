import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeroDescriptionComponent } from './components/hero-description/hero-description.component';
import { HeroIdentityComponent } from './components/hero-identity/hero-identity.component';
import { HeroPortraitComponent } from './components/hero-portrait/hero-portrait.component';
import { HERO_DESCRIPTION, HERO_IDENTITY, HERO_PORTRAIT } from './hero.data';

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
  readonly description = HERO_DESCRIPTION;
  readonly identity = HERO_IDENTITY;
  readonly portrait = HERO_PORTRAIT;
}
