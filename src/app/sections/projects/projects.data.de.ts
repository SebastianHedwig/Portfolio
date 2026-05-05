import { type ProjectsContent } from './projects.data';

export const PROJECTS_CONTENT_DE: ProjectsContent = {
  entry: {
    eyebrow: 'Selected Work',
    titleLines: [
      'Projekte',
      'die zeigen ',
      'wie aus :',
      'Struktur',
      'Haltung',
      'Präzision',
      'digitale',
      'Ergebnisse',
      'entstehen.',
    ],
    lead:
      'Kein Katalog. Kein Raster. Nur drei fokussierte Momente, die jeweils einen anderen Teil meiner Arbeitsweise sichtbar machen.',
  },
  viewportAriaLabel: 'Projektsequenz',
  items: [
    {
      index: 'Struktur, damit es läuft.',
      eyebrow: 'KanBan Board',
      title: 'Join',
      actions: {
        githubHref: 'https://github.com/SebastianHedwig/Project_Join',
      },
      description: {
        label: 'Beschreibung',
        value: 'Ein Aufgabenmanager, inspiriert vom Kanban-System, der Struktur, Interaktion und Zusammenarbeit in eine klare Oberfläche übersetzt. Umgesetzt mit reinem JavaScript, Drag-and-Drop und Echtzeit-Synchronisierung über Firebase.',
      },
      stack: {
        label: 'Stack',
        value: 'Java Script, CSS HTML und Firebase.',
        icons: [
          {
            src: 'assets/icons/tech-stack/JavaScript.svg',
            alt: 'JavaScript',
          },
          {
            src: 'assets/icons/tech-stack/Css.svg',
            alt: 'CSS',
          },
          {
            src: 'assets/icons/tech-stack/Html.svg',
            alt: 'HTML',
          },
          {
            src: 'assets/icons/tech-stack/Firebase.svg',
            alt: 'Firebase',
          },
        ],
      },
      visual: {
        src: 'assets/images/projects/project-join-1500.png',
        width: 1500,
        height: 1001,
        alt: 'Projektvorschau von Join',
      },
    },
    {
      index: 'Ein gutes Spielgefühl',
      eyebrow: '2d - Platformer',
      title: 'Panda - Jungle Run',
      actions: {
        githubHref: 'https://github.com/SebastianHedwig/Panda_Jungle_Run',
      },
      description: {
        label: 'Beschreibung',
        value: 'Ein 2D-Platformer im Browser. Entwickelt in JavaScript mit eigener Engine. Inspiriert von klassischen Side-Scrolling-Platformern und für alle Endgeräte optimiert. Zentrale Spielfigur ist ein Panda, der sich durch den Dschungel bewegt und dabei auf verschiedene Herausforderungen trifft.',
      },
      stack: {
        label: 'Stack',
        value: 'Java Script, HTML und CSS.',
        icons: [
          {
            src: 'assets/icons/tech-stack/JavaScript.svg',
            alt: 'JavaScript',
          },
          {
            src: 'assets/icons/tech-stack/Html.svg',
            alt: 'HTML',
          },
          {
            src: 'assets/icons/tech-stack/Css.svg',
            alt: 'CSS',
          },
        ],
      },
      visual: {
        src: 'assets/images/projects/project-panda-1500.png',
        width: 1500,
        height: 1000,
        alt: 'Projektvorschau von Panda Jungle Run',
      },
    },
    {
      index: 'Alle Pokémon im Überblick',
      eyebrow: 'API - basierte Anwendung',
      title: 'Pokédex',
      actions: {
        githubHref: 'https://github.com/SebastianHedwig/Pokedex_Page',
      },
      description: {
        label: 'Beschreibung',
        value: 'Ein Pokédex im Browser, basierend auf der PokéAPI. Die Anwendung strukturiert und visualisiert umfangreiche Datensätze und macht sie über eine klare Oberfläche zugänglich.',
      },
      stack: {
        label: 'Stack',
        value: 'Java Script, HTML, CSS und REST API.',
        icons: [
          {
            src: 'assets/icons/tech-stack/JavaScript.svg',
            alt: 'JavaScript',
          },
          {
            src: 'assets/icons/tech-stack/Html.svg',
            alt: 'HTML',
          },
          {
            src: 'assets/icons/tech-stack/Css.svg',
            alt: 'CSS',
          },
          {
            src: 'assets/icons/tech-stack/Api.svg',
            alt: 'REST API',
          },
        ],
      },
      visual: {
        src: 'assets/images/projects/project-pokedex-1280.png',
        width: 1280,
        height: 792,
        alt: 'Projektvorschau eines Pokédex',
      },
    },
  ],
} as const;
