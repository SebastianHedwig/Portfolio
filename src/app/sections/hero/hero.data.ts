import {
  type HeroDescriptionData,
  type HeroIdentityData,
  type HeroPortraitData,
} from './hero.models';

export const HERO_DESCRIPTION: HeroDescriptionData = {
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
    'Frontend Entwicklung mit Fokus auf Interaktion, Performance und saubere Umsetzung.',
  actions: [
    {
      href: '#projects',
      label: 'View Projects',
      modifierClass: 'hero-description__action--primary',
    },
    {
      href: '#contact',
      label: "Let's Talk",
      modifierClass: 'hero-description__action--secondary',
    },
  ],
};

export const HERO_IDENTITY: HeroIdentityData = {
  name: 'Sebastian Hedwig',
  tagline: 'Frontend Developer',
};

export const HERO_PORTRAIT: HeroPortraitData = {
  src: 'assets/images/portraits/sebastian-portrait-1600.png',
  alt: 'Portrait von Sebastian Hedwig',
};
