import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeroDescriptionComponent } from './components/hero-description/hero-description.component';
import { HeroIdentityComponent } from './components/hero-identity/hero-identity.component';
import { HeroPortraitComponent } from './components/hero-portrait/hero-portrait.component';
import {
  type HeroDescriptionData,
  type HeroIdentityData,
  type HeroPortraitData,
} from './hero.models';

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
  readonly description: HeroDescriptionData = {
    eyebrow: 'Design trifft Performance',
    headlineLines: [
      'Moderne',
      'Web',
      'Experiences,',
      'die nicht nur',
      'funktionieren,',
      'sondern',
      'überzeugen',
    ],
    text:
      'Frontend Entwicklung mit Fokus auf Interaktion, Performance und saubere Umsetzung.',
    actions: [
      {
        href: '#projects',
        label: 'View Projects',
        modifierClass: 'hero-description__action--primary',
      },
      {
        href: '#contact',
        label: "Let's Talk",
        modifierClass: 'hero-description__action--secondary',
      },
    ],
  };

  readonly identity: HeroIdentityData = {
    name: 'Sebastian Hedwig',
    tagline: 'Frontend Developer',
  };

  readonly portrait: HeroPortraitData = {
    src: 'assets/images/portraits/sebastian-portrait-1600.png',
    alt: 'Portrait von Sebastian Hedwig',
  };
}
