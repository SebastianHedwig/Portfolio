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
  private readonly accentWordPattern = /(Werkzeug|Nutzen)/g;

  getTitleSegments(line: string): readonly TitleSegment[] {
    if (this.block().containerClass !== 'tech-stage__intro') {
      return [{ accent: false, text: line }];
    }

    const matches = Array.from(line.matchAll(this.accentWordPattern));
    if (matches.length === 0) return [{ accent: false, text: line }];

    const segments: TitleSegment[] = [];
    let lastIndex = 0;

    for (const match of matches) {
      const index = match.index ?? 0;
      if (index > lastIndex) {
        segments.push({ accent: false, text: line.slice(lastIndex, index) });
      }

      segments.push({ accent: true, text: match[0] });
      lastIndex = index + match[0].length;
    }

    if (lastIndex < line.length) {
      segments.push({ accent: false, text: line.slice(lastIndex) });
    }

    return segments;
  }
}
