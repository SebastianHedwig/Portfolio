import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero-identity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './hero-identity.component.html',
  styleUrl: './hero-identity.component.scss',
})
export class HeroIdentityComponent {}
