import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type ProjectsEntryContent } from '../../projects.data';

interface ProjectsStageEntryLine {
  accent: boolean;
  className: string;
  text: string;
}

export const PROJECTS_STAGE_ENTRY_REVEALS = [
  {
    selector: '.projects-stage__eyebrow',
    start: 'top 92%',
    end: 'top 56%',
  },
  {
    selector:
      '.projects-stage__title-line--1, .projects-stage__title-line--2, .projects-stage__title-line--3',
    start: 'top 90%',
    end: 'top 52%',
    trigger: '.projects-stage__title-line--1',
  },
  {
    selector: '.projects-stage__title-line--4',
    start: 'top 98%',
    end: 'top 58%',
    trigger: '.projects-stage__title-line--4',
  },
  {
    selector: '.projects-stage__title-line--5',
    start: 'top 92%',
    end: 'top 52%',
    trigger: '.projects-stage__title-line--5',
  },
  {
    selector: '.projects-stage__title-line--6',
    start: 'top 86%',
    end: 'top 46%',
    trigger: '.projects-stage__title-line--6',
  },
  {
    selector:
      '.projects-stage__title-line--7, .projects-stage__title-line--8, .projects-stage__title-line--9',
    start: 'top 84%',
    end: 'top 48%',
    trigger: '.projects-stage__title-line--7',
  },
  {
    selector: '.projects-stage__subtitle',
    start: 'top 74%',
    end: 'top 40%',
    trigger: '.projects-stage__title-line--7',
  },
] as const;

@Component({
  selector: 'app-projects-stage-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './projects-stage-entry.component.html',
  styleUrl: './projects-stage-entry.component.scss',
  host: {
    'class': 'projects-stage__entry',
  },
})
export class ProjectsStageEntryComponent {
  readonly content = input.required<ProjectsEntryContent>();
  readonly lines = computed(() => this.createLines());

  private createLines(): readonly ProjectsStageEntryLine[] {
    return this.content().titleLines.map((text, index) => ({
      accent: this.isAccentLine(index),
      className: `projects-stage__title-line projects-stage__title-line--${index + 1}`,
      text,
    }));
  }

  private isAccentLine(index: number): boolean {
    return index >= 3 && index <= 5;
  }
}
