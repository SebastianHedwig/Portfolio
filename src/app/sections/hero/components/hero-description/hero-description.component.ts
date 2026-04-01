import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './hero-description.component.html',
  styleUrl: './hero-description.component.scss',
})
export class HeroDescriptionComponent {}
