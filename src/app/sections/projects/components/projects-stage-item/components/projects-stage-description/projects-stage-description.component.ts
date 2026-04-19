import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type ProjectStageDetailData } from '../../../../projects.models';

@Component({
  selector: 'app-projects-stage-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './projects-stage-description.component.html',
  styleUrl: './projects-stage-description.component.scss',
})
export class ProjectsStageDescriptionComponent {
  readonly description = input.required<ProjectStageDetailData>();
  readonly ambientClass = input<string | null>(null);
}
