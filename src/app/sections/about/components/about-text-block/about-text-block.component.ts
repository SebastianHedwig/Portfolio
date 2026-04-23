import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { type AboutTextBlockData } from '../../about.models';

@Component({
  selector: 'app-about-text-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './about-text-block.component.html',
  styleUrl: './about-text-block.component.scss',
  host: {
    '[class]': 'containerClass()',
  },
})
export class AboutTextBlockComponent {
  readonly block = input.required<AboutTextBlockData>();
  readonly containerClass = computed(() => this.block().containerClass);
  readonly titleLines = computed(() => this.block().title.split('\n'));
  readonly copySegments = computed(() => this.getCopySegments());
  private readonly accentPattern = /(Erlebnisse|sind das Ergebnis|experiences|they are the result)/gi;
  private readonly accentSegments = new Set([
    'erlebnisse',
    'sind das ergebnis',
    'experiences',
    'they are the result',
  ]);

  private getCopySegments(): Array<{ accent: boolean; text: string }> {
    const copy = this.block().copy;

    if (!this.containerClass().includes('about-stage__context-block--left')) {
      return [{ accent: false, text: copy }];
    }

    const segments = copy.split(this.accentPattern).filter((segment) => segment.length > 0);

    return segments.map((segment) => ({
      accent: this.accentSegments.has(segment.toLowerCase()),
      text: segment,
    }));
  }
}
