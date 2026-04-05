import { type ProjectStageItemData } from './projects.models';

export const PROJECTS_STAGE_ITEMS: readonly ProjectStageItemData[] = [
  {
    index: 'Projekt 01',
    eyebrow: 'Editorial Commerce',
    title: 'Atlas Atelier',
    summary: 'Ein ruhiger Commerce-Auftritt, der Produktinszenierung, Orientierung und Conversion ohne klassische Shop-Hektik zusammenbringt.',
    visualLabel: 'Launch Stage',
    visualCopy: 'Reduzierte Produktdarstellung mit klarer Blickfuehrung, bewusstem Weissraum und einer Oberflaeche, die Hochwertigkeit eher andeutet als behauptet.',
    details: [
      {
        label: 'Beschreibung',
        value: 'Editorial Commerce mit ruhiger Fuehrung, klaren Prioritaeten und einer Oberflaeche, die bewusst auf Druck verzichtet.',
      },
      {
        label: 'Stack',
        value: 'Angular, TypeScript, SCSS und Content Modellierung.',
      },
    ],
  },
  {
    index: 'Projekt 02',
    eyebrow: 'Structured Platform',
    title: 'Northline Workspace',
    summary: 'Eine inhaltsstarke Plattform, die viele Zustaende, Ebenen und Informationen aufnehmen kann, ohne unruhig oder technisch schwer zu wirken.',
    visualLabel: 'System View',
    visualCopy: 'Gebaut fuer Orientierung: klare Raster im Hintergrund, sichtbare Prioritaeten im Vordergrund und eine Struktur, die auch unter Dichte stabil bleibt.',
    details: [
      {
        label: 'Beschreibung',
        value: 'Eine dichte Plattformstruktur, die viele Ebenen aufnehmen kann, ohne an Ruhe, Lesbarkeit oder Ordnung zu verlieren.',
      },
      {
        label: 'Stack',
        value: 'Angular, Signals, modulare Komponenten und SCSS.',
      },
    ],
  },
  {
    index: 'Projekt 03',
    eyebrow: 'Brand Showcase',
    title: 'Monarch Motion Lab',
    summary: 'Ein markenorientierter Showcase, in dem Typografie, Raum und spaeter moegliche Bewegung bereits in der statischen Komposition vorbereitet sind.',
    visualLabel: 'Presentation Frame',
    visualCopy: 'Die Buehne bleibt bewusst reduziert, damit Bildsprache, Rhythmus und die kontrollierte Spannung der Komposition im Vordergrund stehen.',
    details: [
      {
        label: 'Beschreibung',
        value: 'Ein markengetriebener Auftritt, der Typografie, Raum und spaetere Bewegung schon in der statischen Komposition vorbereitet.',
      },
      {
        label: 'Stack',
        value: 'Angular, SCSS Architektur und motionbereite Struktur.',
      },
    ],
  },
];
