export interface FooterIcon {
  alt: string;
  label: string;
  letters: readonly string[];
  src: string;
}

export const FOOTER_CONTENT = {
  brand: {
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
  icons: [
    {
      alt: 'Mail',
      label: 'Mail',
      letters: ['M', 'a', 'i', 'l'],
      src: 'assets/icons/footer/Mail-icon.svg',
    },
    {
      alt: 'GitHub',
      label: 'GitHub',
      letters: ['G', 'i', 't', 'H', 'u', 'b'],
      src: 'assets/icons/footer/GitHub-icon.svg',
    },
    {
      alt: 'LinkedIn',
      label: 'LinkedIn',
      letters: ['L', 'i', 'n', 'k', 'e', 'd', 'I', 'n'],
      src: 'assets/icons/footer/linkedIn-icon.svg',
    },
  ] as const satisfies readonly FooterIcon[],
} as const;
