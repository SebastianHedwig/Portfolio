import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { type TechStackTextBlockData } from '../../tech-stack.models';

interface TitleSegment {
  accent: boolean;
  text: string;
}

@Component({
  selector: 'app-tech-stack-text-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './tech-stack-text-block.component.html',
  styleUrl: './tech-stack-text-block.component.scss',
  host: {
    '[class]': 'containerClass()',
  },
})
export class TechStackTextBlockComponent {
  readonly block = input.required<TechStackTextBlockData>();
  readonly containerClass = computed(() => this.block().containerClass);
  private readonly accentWordPattern = /(Werkzeug|Nutzen|tool|value)/gi;

  getTitleSegments(line: string): readonly TitleSegment[] {
    if (!this.isIntroBlock()) return [{ accent: false, text: line }];
    const segments: TitleSegment[] = [];
    const matches = Array.from(line.matchAll(this.accentWordPattern));
    if (matches.length === 0) return [{ accent: false, text: line }];

    this.appendSegments(line, matches, segments);
    return segments;
  }

  private isIntroBlock(): boolean {
    return this.block().containerClass === 'tech-stage__intro';
  }

  private appendSegments(
    line: string,
    matches: RegExpMatchArray[],
    segments: TitleSegment[],
  ): void {
    let lastIndex = 0;

    matches.forEach((match) => {
      lastIndex = this.appendSegmentPair(line, match, lastIndex, segments);
    });
    this.appendTrailingSegment(line, lastIndex, segments);
  }

  private appendSegmentPair(
    line: string,
    match: RegExpMatchArray,
    lastIndex: number,
    segments: TitleSegment[],
  ): number {
    const index = match.index ?? 0;
    if (index > lastIndex) segments.push({ accent: false, text: line.slice(lastIndex, index) });
    segments.push({ accent: true, text: match[0] });
    return index + match[0].length;
  }

  private appendTrailingSegment(
    line: string,
    lastIndex: number,
    segments: TitleSegment[],
  ): void {
    if (lastIndex < line.length) {
      segments.push({ accent: false, text: line.slice(lastIndex) });
    }
  }
}
