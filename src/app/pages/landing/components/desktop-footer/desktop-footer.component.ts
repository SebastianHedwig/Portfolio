import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FOOTER_CONTENT } from './desktop-footer.data';

@Component({
  selector: 'app-desktop-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './desktop-footer.component.html',
  styleUrl: './desktop-footer.component.scss',
})
export class DesktopFooterComponent {
  readonly footer = FOOTER_CONTENT;
}
