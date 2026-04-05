import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
  readonly label = input.required<string>();
  readonly copy = input.required<string>();
}
