import { type LegalPageContent } from '../imprint/imprint.data';

export const PRIVACY_CONTENT_DE: LegalPageContent = {
  closeLabel: 'Schliessen',
  eyebrow: 'Rechtliches',
  title: 'Datenschutzerklaerung',
  lead: 'Die Struktur steht bereits. Der endgueltige Datenschutztext wird anschliessend in dieses Layout eingesetzt.',
  sections: [
    {
      title: 'Datenschutz auf einen Blick',
      paragraphs: [
        'Der finale Text fuer die Datenschutzerklaerung wird hier im naechsten Schritt eingefuegt.',
        'Aktuell ist dieser Bereich bewusst als Platzhalter angelegt, damit Struktur und Gestaltung bereits sauber vorbereitet sind.',
      ],
    },
    {
      title: 'Verarbeitung personenbezogener Daten',
      paragraphs: [
        'Hier folgt spaeter der konkrete Fliesstext zu Zweck, Umfang, Rechtsgrundlage und Speicherdauer der Datenverarbeitung.',
      ],
    },
    {
      title: 'Kontaktformular und technische Dienste',
      paragraphs: [
        'Sobald du mir den finalen Inhalt gibst, ersetze ich diesen Abschnitt durch die verbindlichen Hinweise zu Formular, Hosting und weiteren eingesetzten Diensten.',
      ],
    },
  ],
} as const;
