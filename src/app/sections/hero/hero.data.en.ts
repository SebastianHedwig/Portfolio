import { type HeroContent } from './hero.data';

export const HERO_CONTENT_EN: HeroContent = {
  description: {
    eyebrow: 'Design meets performance',
    headlineLines: [
      'Modern',
      'web',
      'experiences,',
      'that do more',
      'than just work,',
      'they also',
      'convince',
    ],
    text:
      'Frontend development focused on interaction, experience, and performance. Carefully built with ANGULAR, TYPESCRIPT, and SCSS.',
    action: {
      href: '#contact',
      label: "Let's talk",
    },
  },
  identity: {
    name: 'Sebastian Hedwig',
    tagline: 'Frontend Developer',
  },
  portrait: {
    src: 'assets/images/portraits/sebastian-portrait-1600.png',
    alt: 'Portrait of Sebastian Hedwig',
  },
  statementParts: [
    'BASED IN FLÖRSHEIM',
    'OPEN FOR OPPORTUNITIES',
    'AVAILABLE FOR REMOTE WORK',
  ],
} as const;
