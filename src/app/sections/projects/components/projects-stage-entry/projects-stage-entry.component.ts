import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { type ProjectStageVisualState } from '../../projects.models';

@Component({
  selector: 'app-projects-stage-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './projects-stage-entry.component.html',
  styleUrl: './projects-stage-entry.component.scss',
  host: {
    'class': 'projects-stage__entry',
    '[style.opacity]': 'opacity()',
    '[style.pointer-events]': 'pointerEvents()',
    '[style.transform]': 'transform()',
    '[style.z-index]': 'zIndex()',
  },
})
export class ProjectsStageEntryComponent {
  readonly eyebrow = input.required<string>();
  readonly titleLines = input.required<readonly string[]>();
  readonly lead = input.required<string>();
  readonly state = input.required<ProjectStageVisualState>();

  readonly opacity = computed(() => this.state().opacity);
  readonly pointerEvents = computed(() => this.state().pointerEvents);
  readonly transform = computed(() => this.state().transform);
  readonly zIndex = computed(() => this.state().zIndex);
}
