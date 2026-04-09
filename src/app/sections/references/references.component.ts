import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-references',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss',
})
export class ReferencesComponent {}
