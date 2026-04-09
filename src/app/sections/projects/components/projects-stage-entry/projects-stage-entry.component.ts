import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

interface ProjectsStageEntryLine {
  accent: boolean;
  className: string;
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
    'digitale Erlebnisse ',
    'entstehen.',
  ] as const;
  readonly lead =
    'Kein Katalog. Kein Raster. Nur drei fokussierte Momente, die jeweils einen anderen Teil meiner Arbeitsweise sichtbar machen.';
  readonly lines = computed(() => this.createLines());

  private createLines(): readonly ProjectsStageEntryLine[] {
    return this.titleLines.map((text, index) => ({
      accent: this.isAccentLine(index),
      className: `projects-stage__title-line projects-stage__title-line--${index + 1}`,
      text,
    }));
  }

  private isAccentLine(index: number): boolean {
    return index >= 3 && index <= 5;
  }
}
