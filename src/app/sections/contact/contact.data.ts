export interface ContactContent {
  eyebrow: string
  title: string
  copy: readonly string[]
  cvLinkLabel: string
  cvHref: string
  consentPrefix: string
  consentLinkLabel: string
  consentHref: string
  consentMiddle: string
  consentSuffix: string
  submitLabel: string
}

export const CONTACT_CONTENT: ContactContent = {
  eyebrow: 'Contact',
  title: 'Bereit, etwas umzusetzen?',
  copy: [
    'Wenn du eine Idee hast oder etwas aufbauen möchtest —\nLass uns sprechen.',
    'Ich lege großen Wert auf saubere, durchdachte Lösungen, entwickle mich kontinuierlich weiter und bin offen für neue Herausforderungen und Zusammenarbeit.',
  ],
  cvLinkLabel: 'Lebenslauf ansehen (PDF)',
  cvHref: 'https://ceqznaimpbtixlgvypcy.supabase.co/storage/v1/object/public/cv/Lebenslauf_Hedwig_Sebastian.pdf',
  consentPrefix: 'Ich habe die ',
  consentLinkLabel: 'Datenschutzerklärung',
  consentHref: '#legal',
  consentMiddle: ' gelesen und stimme der Verarbeitung',
  consentSuffix: 'meiner Daten zur Kontaktaufnahme zu.',
  submitLabel: 'Nachricht senden',
}
