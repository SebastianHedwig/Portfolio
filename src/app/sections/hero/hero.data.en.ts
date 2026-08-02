import { type HeroContent } from './hero.data';

export const HERO_CONTENT_EN: HeroContent = {
  description: {
    eyebrow: 'Design meets performance',
    headlineLines: [
      'Modern',
      'web experiences,',
      'that work',
      'and convince.',
    ],
    text:
      'Frontend development with ANGULAR, TYPESCRIPT and SCSS.',
    textDetail: 'Performant. Maintainable. Thoughtfully built.',
    qualities: 'Performance · Maintainability · Accessibility · User Experience',
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
    compactMobileWebpSrc: 'assets/images/portraits/sebastian-portrait-1200.webp',
    mobileWebpSrc: 'assets/images/portraits/sebastian-portrait-1600.webp',
    webpSrc: 'assets/images/portraits/sebastian-portrait-1600.webp',
    width: 1600,
    height: 1067,
    alt: 'Portrait of Sebastian Hedwig',
  },
  statementParts: [
    'BASED IN FLÖRSHEIM',
    'OPEN FOR OPPORTUNITIES',
    'AVAILABLE FOR REMOTE WORK',
  ],
} as const;
