import { type LegalPageContent } from './imprint.data';

export const IMPRINT_CONTENT_EN: LegalPageContent = {
  closeLabel: 'Close',
  eyebrow: 'Legal',
  title: 'Imprint',
  lead: 'Information according to Section 5 TMG.',
  sections: [
    {
      title: 'Provider information',
      paragraphs: [
        'Sebastian Hedwig\nMoselstraße 3\n65439 Flörsheim am Main\nGermany',
      ],
    },
    {
      title: 'Contact',
      paragraphs: [
        'Phone: 0151 23537848\nEmail: sebastian.hedwig@web.de',
      ],
    },
    {
      title: 'Privacy policy',
      paragraphs: [],
      blocks: [
        {
          type: 'source',
          label: 'You can find the privacy policy at the following link:',
          text: 'Click here',
          href: '/en/datenschutz',
        },
      ],
    },
    {
      title: 'Liability for links',
      paragraphs: [
        'This website contains links to external third-party websites. I have no influence over their content and therefore cannot assume any responsibility for this external content. At the time the links were created, no unlawful content was apparent. If I become aware of any legal violations, I will remove the corresponding links immediately.',
      ],
    },
    {
      title: 'Assets from',
      paragraphs: [],
      blocks: [
        {
          type: 'source',
          label: 'Pixabay:',
          text: 'https://pixabay.com',
          href: 'https://pixabay.com',
        },
        {
          type: 'source',
          label: 'Flaticon:',
          text: 'https://www.flaticon.com',
          href: 'https://www.flaticon.com',
        },
        {
          type: 'source',
          label: 'Icons8:',
          text: 'https://icons8.com',
          href: 'https://icons8.com',
        },
        {
          type: 'source',
          label: 'Developer Academy:',
          text: 'https://developerakademie.com',
          href: 'https://developerakademie.com',
        },
      ],
    },
  ],
} as const;
