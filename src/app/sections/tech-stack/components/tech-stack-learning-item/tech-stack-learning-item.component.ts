import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { type TechStackItemData } from '../../tech-stack.models';

@Component({
  selector: 'app-tech-stack-learning-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './tech-stack-learning-item.component.html',
  styleUrl: './tech-stack-learning-item.component.scss',
  host: {
    'class': 'tech-stage__learning',
    'aria-hidden': 'true',
    '(mouseenter)': 'setHovered(true)',
    '(mouseleave)': 'setHovered(false)',
  },
})
export class TechStackLearningItemComponent {
  readonly item = input.required<TechStackItemData>();
  readonly hoverChanged = output<boolean>();

  setHovered(isHovered: boolean): void {
    this.hoverChanged.emit(isHovered);
  }
}
