import { type CaseStudiesContent } from './case-studies.data';

export const CASE_STUDIES_CONTENT_DE: CaseStudiesContent = {
  eyebrow: 'Technische Einblicke',
  title: 'Wissen & Architektur',
  preview: {
    label: 'Portfolio-Fallstudie',
    title: 'Architektur hinter der Oberfläche.',
    description:
      'Eine kompakte Fallstudie über Designentscheidungen, Motion, Performance, SEO und Infrastruktur.',
    cta: 'Zur Studie',
    ctaHover: 'Anzeigen',
    studyHref: '/de/fallstudien',
    githubHref: 'https://github.com/SebastianHedwig/Portfolio',
    githubLabel: 'GitHub',
    image: 'assets/images/case-studies/portfolio-hero-preview-de.webp',
    alt: 'Preview der deutschen Portfolio-Startseite von Sebastian Hedwig',
    chips: ['Angular', 'GSAP', 'Three.js', 'SEO', 'VPS', 'Performance'],
    chipsLabel: 'Technologien und Schwerpunkte',
  },
} as const;
