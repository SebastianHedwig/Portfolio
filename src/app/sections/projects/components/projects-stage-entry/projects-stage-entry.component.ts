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
    start: 'top 112%',
    end: 'top 76%',
  },
  {
    selector:
      '.projects-stage__title-line--1, .projects-stage__title-line--2, .projects-stage__title-line--3',
    start: 'top 110%',
    end: 'top 74%',
    trigger: '.projects-stage__title-line--1',
  },
  {
    selector: '.projects-stage__title-line--4',
    start: 'top 120%',
    end: 'top 84%',
    trigger: '.projects-stage__title-line--4',
  },
  {
    selector: '.projects-stage__title-line--5',
    start: 'top 116%',
    end: 'top 80%',
    trigger: '.projects-stage__title-line--5',
  },
  {
    selector: '.projects-stage__title-line--6',
    start: 'top 112%',
    end: 'top 76%',
    trigger: '.projects-stage__title-line--6',
  },
  {
    selector:
      '.projects-stage__title-line--7, .projects-stage__title-line--8, .projects-stage__title-line--9',
    start: 'top 110%',
    end: 'top 74%',
    trigger: '.projects-stage__title-line--7',
  },
  {
    selector: '.projects-stage__subtitle',
    start: 'top 106%',
    end: 'top 72%',
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
  readonly introLines = computed(() => this.lines().slice(0, 3));
  readonly keywordLines = computed(() => this.lines().slice(3, 6));
  readonly resultLines = computed(() => this.lines().slice(6));
  readonly leadLines = computed(() => this.content().lead.split('\n'));

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
