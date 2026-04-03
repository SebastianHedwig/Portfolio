import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type HeroIdentityData } from '../../hero.models';

@Component({
  selector: 'app-hero-identity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './hero-identity.component.html',
  styleUrl: './hero-identity.component.scss',
})
export class HeroIdentityComponent {
  readonly content = input.required<HeroIdentityData>();
}
