export interface ReferenceQuote {
  author: string;
  paragraphs: readonly string[];
  variant: 'primary' | 'secondary';
}

export const REFERENCES_EYEBROW = 'References';

export const REFERENCES_TITLE = 'Stimmen';

export const REFERENCES_QUOTES: readonly ReferenceQuote[] = [
  {
    variant: 'primary',
    paragraphs: [
      '„Sehr zuverlässig und immer den Überblick – man muss sich keine Sorgen machen, dass etwas untergeht. Er hat ein wirklich ausgeprägtes Verantwortungsbewusstsein, ohne dabei verkrampft zu wirken – was ehrlich gesagt selten ist..',
      'Er ist einfach ein angenehmer Mensch im Umgang. Man kommt leicht mit ihm ins Gespräch und die Zusammenarbeit ist unkompliziert. Außerdem verbessert er das Teamklima spürbar, allein durch seine Art.',
      'Die Art von Kollege, mit der man wirklich gerne zusammenarbeitet.“',
    ],
    author: '— Daniel M., Teamkollege in der Developer Akademie',
  },
  {
    variant: 'secondary',
    paragraphs: [
      '„Überdurchschnittlich engagierte Führungskraft und immer mit vollem Einsatz bei der Sache. Analysiert schnell und präzise und findet Lösungen, die er konsequent umsetzt.',
      'Im Umgang jederzeit vorbildlich und von Vorgesetzten, Kollegen und Kunden gleichermaßen geschätzt. Fördert die Zusammenarbeit aktiv und stellt das Team über persönliche Interessen.“',
    ],
    author: 'Dominic R. — ehemaliger Vorgesetzter',
  },
] as const;
