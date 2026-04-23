import { type LegalPageContent } from './imprint.data';

export const IMPRINT_CONTENT_DE: LegalPageContent = {
  closeLabel: 'Schliessen',
  eyebrow: 'Rechtliches',
  title: 'Impressum',
  lead: 'Diese Seite ist vorbereitet und wird mit deinem finalen Impressumstext vervollstaendigt.',
  sections: [
    {
      title: 'Anbieterangaben',
      paragraphs: [
        'Die finalen Angaben fuer das Impressum werden hier im naechsten Schritt eingefuegt.',
        'Aktuell dient dieser Bereich als Platzhalter fuer Name, Anschrift, Kontakt und weitere gesetzlich erforderliche Informationen.',
      ],
    },
    {
      title: 'Kontakt',
      paragraphs: [
        'Hier folgt spaeter der verbindliche Kontaktblock mit E-Mail-Adresse und weiteren Pflichtangaben.',
      ],
    },
    {
      title: 'Hinweise',
      paragraphs: [
        'Sobald der finale Text vorliegt, wird diese Seite inhaltlich vollstaendig ersetzt, das Layout kann so bestehen bleiben.',
      ],
    },
  ],
} as const;
