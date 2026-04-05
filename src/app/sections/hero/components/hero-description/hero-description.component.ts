import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type HeroDescriptionData } from '../../hero.models';

@Component({
  selector: 'app-hero-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './hero-description.component.html',
  styleUrl: './hero-description.component.scss',
})
export class HeroDescriptionComponent {
  readonly content = input.required<HeroDescriptionData>();
  private readonly accentLines = new Set(['Moderne', 'Experiences,', 'überzeugen']);

  isAccentLine(line: string): boolean {
    return this.accentLines.has(line);
  }
}
