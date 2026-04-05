import { type ProjectStageItemData } from './projects.models';

export const PROJECTS_STAGE_ITEMS: readonly ProjectStageItemData[] = [
  {
    index: 'Projekt 01',
    eyebrow: 'Editorial Commerce',
    title: 'Atlas Atelier',
    description: {
      label: 'Beschreibung',
      value: 'Editorial Commerce mit ruhiger Fuehrung, klaren Prioritaeten und einer Oberflaeche, die bewusst auf Druck verzichtet.',
    },
    stack: {
      label: 'Stack',
      value: 'Angular, TypeScript, SCSS und Content Modellierung.',
    },
  },
  {
    index: 'Projekt 02',
    eyebrow: 'Structured Platform',
    title: 'Northline Workspace',
    description: {
      label: 'Beschreibung',
      value: 'Eine dichte Plattformstruktur, die viele Ebenen aufnehmen kann, ohne an Ruhe, Lesbarkeit oder Ordnung zu verlieren.',
    },
    stack: {
      label: 'Stack',
      value: 'Angular, Signals, modulare Komponenten und SCSS.',
    },
  },
  {
    index: 'Projekt 03',
    eyebrow: 'Brand Showcase',
    title: 'Monarch Motion Lab',
    description: {
      label: 'Beschreibung',
      value: 'Ein markengetriebener Auftritt, der Typografie, Raum und spaetere Bewegung schon in der statischen Komposition vorbereitet.',
    },
    stack: {
      label: 'Stack',
      value: 'Angular, SCSS Architektur und motionbereite Struktur.',
    },
  },
];
