import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type HeroPortraitData } from '../../hero.models';

@Component({
  selector: 'app-hero-portrait',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './hero-portrait.component.html',
  styleUrl: './hero-portrait.component.scss',
})
export class HeroPortraitComponent {
  readonly content = input.required<HeroPortraitData>();
}
