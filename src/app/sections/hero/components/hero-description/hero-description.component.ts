import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { PrimaryButtonComponent } from '../../../../shared/components/primary-button/primary-button.component';
import { type HeroDescriptionData } from '../../hero.models';

@Component({
  selector: 'app-hero-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PrimaryButtonComponent],
  templateUrl: './hero-description.component.html',
  styleUrl: './hero-description.component.scss',
})
export class HeroDescriptionComponent {
  readonly content = input.required<HeroDescriptionData>();
  readonly headlineLines = computed(() =>
    this.content().headlineLines.map((line) => this.createHeadlineSegments(line)),
  );

  private readonly accentWords = new Set([
    'moderne',
    'experiences,',
    'überzeugen.',
    'modern',
    'convince.',
  ]);

  private createHeadlineSegments(line: string): { text: string; isAccent: boolean }[] {
    return line
      .split(/(\s+)/)
      .map((text) => ({ text, isAccent: this.accentWords.has(text.toLowerCase()) }));
  }
}
