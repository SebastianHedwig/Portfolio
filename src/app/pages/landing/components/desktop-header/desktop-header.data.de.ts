import { type DesktopHeaderContent } from './desktop-header.data';

export const DESKTOP_HEADER_CONTENT_DE: DesktopHeaderContent = {
  brand: {
    ariaLabel: 'Zur Hero-Stage springen',
    firstName: 'Sebastian',
    logoAlt: 'Logo von Sebastian Hedwig',
    logoSrc: 'assets/icons/logo/sh-monogram-128.png',
    surnameInitial: 'H',
    surnameTail: 'edwig',
  },
  languageToggleAriaLabel: 'Sprache wechseln',
  languageToggleLabel: 'Sprache',
  navAriaLabel: 'Hauptnavigation',
  navItems: [
    { href: '#about-intro', label: 'Über mich' },
    { href: '#tech-stack', label: 'Tech Stack' },
    { href: '#projects-first', label: 'Projekte' },
    { href: '#references', label: 'Referenzen' },
    { href: '#contact', label: 'Kontakt' },
  ],
} as const;
