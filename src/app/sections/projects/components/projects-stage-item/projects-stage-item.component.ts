import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ProjectsStageContentComponent } from './components/projects-stage-content/projects-stage-content.component';
import { ProjectsStageDescriptionComponent } from './components/projects-stage-description/projects-stage-description.component';
import { ProjectsStageStackComponent } from './components/projects-stage-stack/projects-stage-stack.component';
import { ProjectsStageVisualComponent } from './components/projects-stage-visual/projects-stage-visual.component';
import { type ProjectStageItemData } from '../../projects.models';

@Component({
  selector: 'app-projects-stage-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProjectsStageContentComponent,
    ProjectsStageDescriptionComponent,
    ProjectsStageStackComponent,
    ProjectsStageVisualComponent,
  ],
  templateUrl: './projects-stage-item.component.html',
  styleUrl: './projects-stage-item.component.scss',
  host: {
    'class': 'projects-stage__project',
  },
})
export class ProjectsStageItemComponent {
  readonly project = input.required<ProjectStageItemData>();

  contentAmbientClass(): string | null {
    return null;
  }

  descriptionAmbientClass(): string | null {
    return null;
  }

  visualAmbientClass(): string | null {
    return 'project-moment__visual-shell--ambient-3';
  }
}
