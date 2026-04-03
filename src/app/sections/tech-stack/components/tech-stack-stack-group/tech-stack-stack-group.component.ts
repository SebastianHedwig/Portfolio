import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { type TechStackGroupData } from '../../tech-stack.models';

@Component({
  selector: 'app-tech-stack-stack-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './tech-stack-stack-group.component.html',
  styleUrl: './tech-stack-stack-group.component.scss',
  host: {
    '[class]': 'hostClass()',
  },
})
export class TechStackStackGroupComponent {
  readonly group = input.required<TechStackGroupData>();
  readonly forceGroupLabelVisible = input(false);

  readonly hostClass = computed(
    () => `tech-stage__stack tech-stage__stack--${this.group().variant}`,
  );

  readonly itemClass = computed(
    () => `tech-stage__item tech-stage__item--${this.group().variant}`,
  );

  readonly iconClass = computed(() =>
    this.group().variant === 'extended'
      ? 'tech-stage__icon tech-stage__icon--extended'
      : 'tech-stage__icon',
  );

  readonly labelClass = computed(() =>
    this.group().variant === 'extended'
      ? 'tech-stage__label tech-stage__label--extended'
      : 'tech-stage__label',
  );

  readonly groupLabelClass = computed(() => {
    const visibleClass = this.forceGroupLabelVisible()
      ? ' tech-stage__group-label--is-visible'
      : '';

    return `tech-stage__group-label tech-stage__group-label--${this.group().variant}${visibleClass}`;
  });
}
