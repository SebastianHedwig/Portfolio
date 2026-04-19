import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './secondary-button.component.html',
  styleUrl: './secondary-button.component.scss',
})
export class SecondaryButtonComponent {
  readonly href = input<string | null>(null);
  readonly label = input.required<string>();
  readonly type = input<'button' | 'submit' | 'reset'>('button');
}
