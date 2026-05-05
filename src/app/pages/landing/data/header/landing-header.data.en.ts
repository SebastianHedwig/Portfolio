import { type LandingHeaderContent } from './landing-header.data';

export const LANDING_HEADER_CONTENT_EN: LandingHeaderContent = {
  brand: {
    ariaLabel: 'Jump to hero stage',
    firstName: 'Sebastian',
    logoAlt: 'Sebastian Hedwig logo',
    logoSrc: 'assets/icons/logo/sh-monogram-128.png',
    surnameInitial: 'H',
    surnameTail: 'edwig',
  },
  closeNavigationAriaLabel: 'Close navigation',
  languageToggleAriaLabel: 'Switch language',
  languageToggleLabel: 'Language',
  navAriaLabel: 'Primary navigation',
  navItems: [
    { href: '#about-intro', label: 'About' },
    { href: '#tech-stack', label: 'Tech Stack' },
    { href: '#projects-first', label: 'Projects' },
    { href: '#references', label: 'References' },
    { href: '#contact', label: 'Contact' },
  ],
} as const;
