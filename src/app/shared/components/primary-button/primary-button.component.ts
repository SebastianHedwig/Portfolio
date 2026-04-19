import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.scss',
})
export class PrimaryButtonComponent {
  readonly href = input<string | null>(null);
  readonly label = input.required<string>();
  readonly type = input<'button' | 'submit' | 'reset'>('button');
}
