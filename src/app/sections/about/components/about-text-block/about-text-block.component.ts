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
}
