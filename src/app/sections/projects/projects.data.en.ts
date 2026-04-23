import { type ProjectsContent } from './projects.data';

export const PROJECTS_CONTENT_EN: ProjectsContent = {
  entry: {
    eyebrow: 'Selected Work',
    titleLines: [
      'Projects',
      'that show ',
      'how :',
      'structure',
      'clarity',
      'precision',
      'become',
      'digital',
      'outcomes.',
    ],
    lead:
      'Not a catalog. Not a grid. Just three focused moments, each revealing a different part of how I work.',
  },
  viewportAriaLabel: 'Project sequence',
  items: [
    {
      index: 'Project 01',
      eyebrow: 'Kanban board',
      title: 'Join',
      description: {
        label: 'Description',
        value: 'A task manager inspired by the Kanban system, translating structure, interaction, and collaboration into a clear interface. Built with vanilla JavaScript, drag and drop, and real-time synchronization through Firebase.',
      },
      stack: {
        label: 'Stack',
        value: 'JavaScript, CSS, HTML, and Firebase.',
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
        alt: 'Join project preview',
      },
    },
    {
      index: 'Project 02',
      eyebrow: '2D platformer',
      title: 'Panda - Jungle Run',
      description: {
        label: 'Description',
        value: 'A 2D browser platformer developed in JavaScript with a custom engine. Inspired by classic side-scrolling platformers and optimized for all screen sizes. The central character is a panda moving through the jungle while facing different challenges.',
      },
      stack: {
        label: 'Stack',
        value: 'JavaScript, HTML, and CSS.',
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
        alt: 'Panda Jungle Run project preview',
      },
    },
    {
      index: 'Project 03',
      eyebrow: 'API-based application',
      title: 'Pokédex',
      description: {
        label: 'Description',
        value: 'A browser-based Pokédex powered by the PokéAPI. The application structures and visualizes large data sets, making them accessible through a clear interface.',
      },
      stack: {
        label: 'Stack',
        value: 'JavaScript, HTML, CSS, and REST API.',
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
        alt: 'Pokédex project preview',
      },
    },
  ],
} as const;
