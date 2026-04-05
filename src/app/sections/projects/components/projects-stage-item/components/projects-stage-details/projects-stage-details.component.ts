import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type ProjectStageDetailData } from '../../../../projects.models';

@Component({
  selector: 'app-projects-stage-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './projects-stage-details.component.html',
  styleUrl: './projects-stage-details.component.scss',
})
export class ProjectsStageDetailsComponent {
  readonly details = input.required<readonly ProjectStageDetailData[]>();
}
