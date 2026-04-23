import { type FooterContent } from './desktop-footer.data';

export const FOOTER_CONTENT_DE: FooterContent = {
  brand: {
    ariaLabel: 'Zur Hero-Stage springen',
    logoSrc: 'assets/icons/logo/sh-monogram-128.png',
    logoAlt: 'Logo von Sebastian Hedwig',
    firstName: 'Sebastian',
    surnameInitial: 'H',
    surnameTail: 'edwig',
    role: 'Frontend Developer',
  },
  meta: {
    copyrightText: 'Sebastian Hedwig 2026',
    location: 'Flörsheim am Main - Hessen, Germany',
  },
  imprintLabel: 'Impressum',
  imprintPath: 'impressum',
  icons: [
    {
      alt: 'Mail',
      letters: ['M', 'a', 'i', 'l'],
      src: 'assets/icons/footer/Mail-icon.svg',
    },
    {
      alt: 'GitHub',
      letters: ['G', 'i', 't', 'H', 'u', 'b'],
      src: 'assets/icons/footer/GitHub-icon.svg',
    },
    {
      alt: 'LinkedIn',
      letters: ['L', 'i', 'n', 'k', 'e', 'd', 'I', 'n'],
      src: 'assets/icons/footer/linkedIn-icon.svg',
    },
  ],
} as const;
