import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeroDescriptionComponent } from './components/hero-description/hero-description.component';
import { HeroIdentityComponent } from './components/hero-identity/hero-identity.component';
import { HeroPortraitComponent } from './components/hero-portrait/hero-portrait.component';

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
export class HeroComponent {}
