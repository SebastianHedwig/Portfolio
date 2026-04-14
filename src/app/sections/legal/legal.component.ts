import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LEGAL_FOOTER } from './legal.data';

@Component({
  selector: 'app-legal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss',
})
export class LegalComponent {
  readonly footer = LEGAL_FOOTER;
}
