import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AboutTextBlockData = {
  containerClass: string;
  copy: string;
  copyClass: string;
  title: string;
  titleClass: string;
  titleTag: 'h2' | 'p';
};

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
