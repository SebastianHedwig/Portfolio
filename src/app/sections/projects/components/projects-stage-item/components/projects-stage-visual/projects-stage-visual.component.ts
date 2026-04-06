import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type ProjectStageVisualData } from '../../../../projects.models';

@Component({
  selector: 'app-projects-stage-visual',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './projects-stage-visual.component.html',
  styleUrl: './projects-stage-visual.component.scss',
  host: {
    'aria-hidden': 'true',
  },
})
export class ProjectsStageVisualComponent {
  readonly visual = input<ProjectStageVisualData>();
}
