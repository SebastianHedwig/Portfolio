import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

interface ProjectsStageEntryLine {
  accent: boolean;
  className: string;
  revealEnd: string;
  revealStart: string;
  revealTrigger: string;
  text: string;
}

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
  readonly eyebrow = 'Selected Work';
  readonly titleLines = [
    'Projekte',
    'die zeigen ',
    'wie aus :',
    'Struktur',
    'Haltung',
    'Präzision',
    'digitale',
    'Ergebnisse',
    'entstehen.',
  ] as const;
  readonly lead =
    'Kein Katalog. Kein Raster. Nur drei fokussierte Momente, die jeweils einen anderen Teil meiner Arbeitsweise sichtbar machen.';
  readonly lines = computed(() => this.createLines());

  private createLines(): readonly ProjectsStageEntryLine[] {
    return this.titleLines.map((text, index) => ({
      accent: this.isAccentLine(index),
      className: `projects-stage__title-line projects-stage__title-line--${index + 1}`,
      ...this.getRevealConfig(index),
      text,
    }));
  }

  private isAccentLine(index: number): boolean {
    return index >= 3 && index <= 5;
  }

  private getRevealConfig(index: number): Omit<ProjectsStageEntryLine, 'accent' | 'className' | 'text'> {
    if (index <= 2) {
      return {
        revealEnd: 'top 52%',
        revealStart: 'top 90%',
        revealTrigger: '.projects-stage__title-line--1',
      };
    }

    if (index === 3) {
      return {
        revealEnd: 'top 58%',
        revealStart: 'top 98%',
        revealTrigger: '.projects-stage__title-line--4',
      };
    }

    if (index === 4) {
      return {
        revealEnd: 'top 52%',
        revealStart: 'top 92%',
        revealTrigger: '.projects-stage__title-line--5',
      };
    }

    if (index === 5) {
      return {
        revealEnd: 'top 46%',
        revealStart: 'top 86%',
        revealTrigger: '.projects-stage__title-line--6',
      };
    }

    return {
      revealEnd: 'top 48%',
      revealStart: 'top 84%',
      revealTrigger: '.projects-stage__title-line--7',
    };
  }
}
