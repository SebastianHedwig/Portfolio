import { type CaseStudiesContent } from './case-studies.data';

export const CASE_STUDIES_CONTENT_EN: CaseStudiesContent = {
  eyebrow: 'Technical Deep Dives',
  title: 'Knowledge & Architecture',
  preview: {
    label: 'Portfolio Case Study',
    title: 'Architecture beneath the surface.',
    description:
      'A compact deep dive into design decisions, motion, performance, SEO, and infrastructure.',
    cta: 'Deep Dive',
    ctaHover: 'Show',
    studyHref: '/en/fallstudien',
    githubHref: 'https://github.com/SebastianHedwig/Portfolio',
    githubLabel: 'GitHub',
    image: 'assets/images/case-studies/portfolio-hero-preview-en.webp',
    alt: 'Preview of the English portfolio homepage by Sebastian Hedwig',
    chips: ['Angular', 'GSAP', 'Three.js', 'SEO', 'VPS', 'Performance'],
    chipsLabel: 'Technologies and focus areas',
  },
} as const;
