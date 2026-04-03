import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  ABOUT_CONTEXT_CENTER,
  ABOUT_CONTEXT_LEFT,
  ABOUT_CONTEXT_RIGHT,
  ABOUT_INTRO_LEAD,
  ABOUT_INTRO_SECONDARY,
  ABOUT_PORTRAIT,
} from './about.data';
import { AboutImageComponent } from './components/about-image/about-image.component';
import { AboutTextBlockComponent } from './components/about-text-block/about-text-block.component';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AboutImageComponent, AboutTextBlockComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly portrait = ABOUT_PORTRAIT;
  readonly introLead = ABOUT_INTRO_LEAD;
  readonly introSecondary = ABOUT_INTRO_SECONDARY;
  readonly contextLeft = ABOUT_CONTEXT_LEFT;
  readonly contextCenter = ABOUT_CONTEXT_CENTER;
  readonly contextRight = ABOUT_CONTEXT_RIGHT;
}
