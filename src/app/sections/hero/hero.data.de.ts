import { type HeroContent } from './hero.data';

export const HERO_CONTENT_DE: HeroContent = {
  description: {
    eyebrow: 'Design trifft Performance',
    headlineLines: [
      'Moderne',
      'Web',
      'Experiences,',
      'die nicht nur',
      'funktionieren,',
      'sondern',
      'überzeugen',
    ],
    text:
      'Frontend Entwicklung mit Fokus auf Interaktion, Erlebnis und Performance. Sauber umgesetzt mit ANGULAR, TYPESCRIPT und SCSS.',
    action: {
      href: '#contact',
      label: "Let's Talk",
    },
  },
  identity: {
    name: 'Sebastian Hedwig',
    tagline: 'Frontend Developer',
  },
  portrait: {
    src: 'assets/images/portraits/sebastian-portrait-1600.png',
    alt: 'Portrait von Sebastian Hedwig',
  },
  statementParts: [
    'BASED IN FLÖRSHEIM',
    'OPEN FOR OPPORTUNITIES',
    'AVAILABLE FOR REMOTE WORK',
  ],
} as const;
