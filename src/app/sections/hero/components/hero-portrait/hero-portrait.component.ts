import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero-portrait',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './hero-portrait.component.html',
  styleUrl: './hero-portrait.component.scss',
})
export class HeroPortraitComponent {}
