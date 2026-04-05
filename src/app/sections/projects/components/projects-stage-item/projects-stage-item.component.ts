import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ProjectsStageContentComponent } from './components/projects-stage-content/projects-stage-content.component';
import { ProjectsStageDetailsComponent } from './components/projects-stage-details/projects-stage-details.component';
import { ProjectsStageVisualComponent } from './components/projects-stage-visual/projects-stage-visual.component';
import {
  type ProjectStageItemData,
  type ProjectStageVisualState,
} from '../../projects.models';

@Component({
  selector: 'app-projects-stage-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProjectsStageContentComponent,
    ProjectsStageDetailsComponent,
    ProjectsStageVisualComponent,
  ],
  templateUrl: './projects-stage-item.component.html',
  styleUrl: './projects-stage-item.component.scss',
  host: {
    'class': 'projects-stage__project',
    '[style.opacity]': 'opacity()',
    '[style.pointer-events]': 'pointerEvents()',
    '[style.transform]': 'transform()',
    '[style.z-index]': 'zIndex()',
  },
})
export class ProjectsStageItemComponent {
  readonly project = input.required<ProjectStageItemData>();
  readonly state = input.required<ProjectStageVisualState>();

  readonly opacity = computed(() => this.state().opacity);
  readonly pointerEvents = computed(() => this.state().pointerEvents);
  readonly transform = computed(() => this.state().transform);
  readonly zIndex = computed(() => this.state().zIndex);
}
