import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type AboutImageData } from '../../about.models';

@Component({
  selector: 'app-about-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './about-image.component.html',
  styleUrl: './about-image.component.scss',
  host: {
    'class': 'about-stage__image-zone',
  },
})
export class AboutImageComponent {
  readonly image = input.required<AboutImageData>();
}
