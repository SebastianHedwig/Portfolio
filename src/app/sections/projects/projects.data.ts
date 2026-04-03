import { type ProjectStageItemData } from './projects.models';

export const PROJECTS_STAGE_ITEMS: readonly ProjectStageItemData[] = [
  {
    index: 'Projekt 01',
    eyebrow: 'Editorial Commerce',
    title: 'Atlas Atelier',
    summary: 'Ein ruhiger Commerce-Auftritt, der Produktinszenierung, Orientierung und Conversion ohne klassische Shop-Hektik zusammenbringt.',
    artifactLabel: 'Launch Stage',
    artifactCopy: 'Reduzierte Produktdarstellung mit klarer Blickfuehrung, bewusstem Weissraum und einer Oberflaeche, die Hochwertigkeit eher andeutet als behauptet.',
    details: [
      {
        label: 'Rolle',
        value: 'UX Konzeption, UI Direction und Angular Frontend.',
      },
      {
        label: 'Stack',
        value: 'Angular, TypeScript, SCSS und Content Modellierung.',
      },
      {
        label: 'Ergebnis',
        value: 'Ein ruhiges Einkaufserlebnis mit klarer Dramaturgie und hoher Lesbarkeit.',
      },
    ],
  },
  {
    index: 'Projekt 02',
    eyebrow: 'Structured Platform',
    title: 'Northline Workspace',
    summary: 'Eine inhaltsstarke Plattform, die viele Zustaende, Ebenen und Informationen aufnehmen kann, ohne unruhig oder technisch schwer zu wirken.',
    artifactLabel: 'System View',
    artifactCopy: 'Gebaut fuer Orientierung: klare Raster im Hintergrund, sichtbare Prioritaeten im Vordergrund und eine Struktur, die auch unter Dichte stabil bleibt.',
    details: [
      {
        label: 'Rolle',
        value: 'Informationsarchitektur, Komponentenlogik und UI System.',
      },
      {
        label: 'Stack',
        value: 'Angular, Signals, modulare Komponenten und SCSS.',
      },
      {
        label: 'Ergebnis',
        value: 'Ein Interface, das Komplexitaet ordnet statt sie nur zu verpacken.',
      },
    ],
  },
  {
    index: 'Projekt 03',
    eyebrow: 'Brand Showcase',
    title: 'Monarch Motion Lab',
    summary: 'Ein markenorientierter Showcase, in dem Typografie, Raum und spaeter moegliche Bewegung bereits in der statischen Komposition vorbereitet sind.',
    artifactLabel: 'Presentation Frame',
    artifactCopy: 'Die Buehne bleibt bewusst reduziert, damit Bildsprache, Rhythmus und die kontrollierte Spannung der Komposition im Vordergrund stehen.',
    details: [
      {
        label: 'Rolle',
        value: 'Visual Direction, responsive Stage und Frontend Umsetzung.',
      },
      {
        label: 'Stack',
        value: 'Angular, SCSS Architektur und motionbereite Struktur.',
      },
      {
        label: 'Ergebnis',
        value: 'Ein Auftritt mit Ruhe, Haltung und einem klaren visuellen Spannungsbogen.',
      },
    ],
  },
];
