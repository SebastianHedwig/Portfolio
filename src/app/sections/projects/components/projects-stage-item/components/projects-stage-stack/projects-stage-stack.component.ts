import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type ProjectStageDetailData } from '../../../../projects.models';

@Component({
  selector: 'app-projects-stage-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './projects-stage-stack.component.html',
  styleUrl: './projects-stage-stack.component.scss',
})
export class ProjectsStageStackComponent {
  readonly stack = input.required<ProjectStageDetailData>();
}
