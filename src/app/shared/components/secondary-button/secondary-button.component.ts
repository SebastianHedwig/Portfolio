import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './secondary-button.component.html',
  styleUrl: './secondary-button.component.scss',
})
export class SecondaryButtonComponent {
  readonly direction = input<'left' | 'right'>('right');
  readonly href = input<string | null>(null);
  readonly label = input.required<string>();
  readonly size = input<'compact' | 'default'>('default');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly clicked = output<void>();
}
