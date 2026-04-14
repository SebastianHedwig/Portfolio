import {
  ChangeDetectionStrategy,
  Component,
  input,
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
  },
})
export class TechStackLearningItemComponent {
  readonly item = input.required<TechStackItemData>();
}
