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
  readonly hasCopy = computed(() => this.block().copy.length > 0);
  readonly hasTitle = computed(() => this.block().title.length > 0);
  readonly hasValueStatements = computed(() => Boolean(this.block().valueStatements?.length));
  readonly titleLines = computed(() =>
    this.block().title.split('\n').map((line) => this.getTitleLineParts(line)),
  );
  readonly valueStatementRows = computed(() =>
    (this.block().valueStatements ?? []).map((statement) => ({
      detail: statement.detail,
      detailLetters: Array.from(statement.detail),
      detailLength: Array.from(statement.detail).length,
      lead: statement.lead,
    })),
  );
  readonly copySegments = computed(() => this.getCopySegments(this.block().copy));
  readonly hasMobileCopy = computed(() => Boolean(this.block().mobileCopy));
  readonly mobileCopySegments = computed(() =>
    this.getCopySegments(this.block().mobileCopy ?? this.block().copy),
  );
  private getTitleLineParts(line: string): { punctuation: string; text: string } {
    const match = line.match(/^(.*?)([.!?])$/);

    return match
      ? { text: match[1], punctuation: match[2] }
      : { text: line, punctuation: '' };
  }

  private readonly accentPattern = /(Erlebnisse|sind das Ergebnis|experiences|are the result)/gi;
  private readonly accentSegments = new Set([
    'erlebnisse',
    'sind das ergebnis',
    'experiences',
    'are the result',
  ]);

  private getCopySegments(copy: string): Array<{ accent: boolean; text: string }> {
    if (!this.shouldAccentCopy()) {
      return [{ accent: false, text: copy }];
    }

    const segments = copy.split(this.accentPattern).filter((segment) => segment.length > 0);

    return segments.map((segment) => ({
      accent: this.accentSegments.has(segment.toLowerCase()),
      text: segment,
    }));
  }

  private shouldAccentCopy(): boolean {
    const containerClass = this.containerClass();

    return containerClass.includes('about-stage__context-block--left')
      || containerClass.includes('about-stage__context-bottom-head');
  }
}
