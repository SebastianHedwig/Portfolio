export interface DesktopHeaderNavItem {
  href: string;
  label: string;
}

export const DESKTOP_HEADER_BRAND = {
  firstName: 'Sebastian',
  logoAlt: 'Logo von Sebastian Hedwig',
  logoSrc: 'assets/icons/logo/sh-monogram-128.png',
  surnameInitial: 'H',
  surnameTail: 'edwig',
} as const;

export const DESKTOP_HEADER_NAV_ITEMS: readonly DesktopHeaderNavItem[] = [
  { href: '#about-intro', label: 'About' },
  { href: '#tech-stack', label: 'Tech Stack' },
  { href: '#projects-first', label: 'Projects' },
  { href: '#references', label: 'References' },
  { href: '#contact', label: 'Contact' },
] as const;
