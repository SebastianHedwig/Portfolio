import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewportBackgroundComponent } from './shared/background/viewport-background.component';
import { CursorRingComponent } from './shared/cursor/cursor-ring.component';
import { SeoService } from './shared/seo/seo.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet, ViewportBackgroundComponent, CursorRingComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly seo = inject(SeoService);
}
