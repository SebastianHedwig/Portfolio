import { type LegalPageContent } from './imprint.data';

export const IMPRINT_CONTENT_DE: LegalPageContent = {
  closeLabel: 'Schliessen',
  eyebrow: 'Rechtliches',
  title: 'Impressum',
  lead: 'Angaben gemäß § 5 TMG.',
  sections: [
    {
      title: 'Anbieterangaben',
      paragraphs: [
        'Sebastian Hedwig\nMoselstraße 3\n65439 Flörsheim am Main',
      ],
    },
    {
      title: 'Kontakt',
      paragraphs: [
        'Telefon: 0151 23537848\nE-Mail: sebastian.hedwig@web.de',
      ],
    },
    {
      title: 'Datenschutz',
      paragraphs: [],
      blocks: [
        {
          type: 'source',
          label: 'Die Datenschutzerklärung finden Sie hier:',
          text: 'Hier klicken',
          href: '/de/datenschutz',
        },
      ],
    },
    {
      title: 'Haftung für Links',
      paragraphs: [
        'Diese Website enthält Links zu externen Websites Dritter. Auf deren Inhalte habe ich keinen Einfluss. Deshalb kann ich für diese fremden Inhalte keine Gewähr übernehmen. Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar. Bei Bekanntwerden von Rechtsverletzungen werde ich entsprechende Links umgehend entfernen.',
      ],
    },
    {
      title: 'Assets von',
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
      ],
    },
  ],
} as const;
