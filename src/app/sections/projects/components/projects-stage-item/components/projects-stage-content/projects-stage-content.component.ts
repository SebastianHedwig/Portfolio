import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PrimaryButtonComponent } from '../../../../../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../../../../../shared/components/secondary-button/secondary-button.component';

@Component({
  selector: 'app-projects-stage-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PrimaryButtonComponent, SecondaryButtonComponent],
  templateUrl: './projects-stage-content.component.html',
  styleUrl: './projects-stage-content.component.scss',
})
export class ProjectsStageContentComponent {
  readonly index = input.required<string>();
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();

  isJoinTitle(): boolean {
    return this.title().toLowerCase() === 'join';
  }

  titleInitial(): string {
    return this.title().charAt(0);
  }

  titleRemainder(): string {
    return this.title().slice(1);
  }
}
