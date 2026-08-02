import { type HeroContent } from './hero.data';

export const HERO_CONTENT_DE: HeroContent = {
  description: {
    eyebrow: 'Design trifft Performance',
    headlineLines: [
      'Moderne',
      'Web Experiences,',
      'die funktionieren',
      'und überzeugen.',
    ],
    text:
      'Frontend-Entwicklung mit ANGULAR, TYPESCRIPT und SCSS.',
    textDetail: 'Performant. Wartbar. Durchdacht.',
    qualities: 'Performance · Wartbarkeit · Barrierefreiheit · User Experience',
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
    compactMobileWebpSrc: 'assets/images/portraits/sebastian-portrait-1200.webp',
    mobileWebpSrc: 'assets/images/portraits/sebastian-portrait-1600.webp',
    webpSrc: 'assets/images/portraits/sebastian-portrait-1600.webp',
    width: 1600,
    height: 1067,
    alt: 'Portrait von Sebastian Hedwig',
  },
  statementParts: [
    'WOHNHAFT IN FLÖRSHEIM',
    'OFFEN FÜR NEUE MÖGLICHKEITEN',
    'VERFÜGBAR FÜR REMOTE-ARBEIT',
  ],
} as const;
