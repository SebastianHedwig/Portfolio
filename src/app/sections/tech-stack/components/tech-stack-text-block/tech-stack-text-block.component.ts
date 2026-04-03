import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { type TechStackTextBlockData } from '../../tech-stack.models';

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
}
