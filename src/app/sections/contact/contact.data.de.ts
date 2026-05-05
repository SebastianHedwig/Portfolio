import { type ContactContent } from './contact.data';

export const CONTACT_CONTENT_DE: ContactContent = {
  eyebrow: 'Kontakt',
  title: 'Bereit, etwas umzusetzen?',
  copy: [
    'Wenn du eine Idee hast oder etwas aufbauen möchtest —\nLass uns sprechen.',
    'Ich lege großen Wert auf saubere, durchdachte Lösungen, entwickle mich kontinuierlich weiter und bin offen für neue Herausforderungen und Zusammenarbeit.',
  ],
  cvLinkLabel: 'Lebenslauf ansehen (PDF)',
  cvHref: 'https://ceqznaimpbtixlgvypcy.supabase.co/storage/v1/object/public/cv/Lebenslauf_Hedwig_Sebastian.pdf',
  consentPrefix: 'Ich habe die ',
  consentLinkLabel: 'Datenschutzerklärung',
  consentHref: 'datenschutz',
  consentMiddle: ' gelesen und stimme der Verarbeitung',
  consentSuffix: 'meiner Daten zur Kontaktaufnahme zu.',
  submitLabel: 'Nachricht senden',
  submittingLabel: 'Wird gesendet...',
  toast: {
    success: 'Nachricht erfolgreich versendet.',
    error: 'Nachricht konnte nicht gesendet werden. \nBitte versuche es später erneut.',
  },
  form: {
    name: {
      label: 'Name',
      placeholder: 'Dein Name',
      requiredError: 'Bitte gib deinen Namen ein.',
      maxlengthError: 'Der Name darf maximal 50 Zeichen lang sein.',
    },
    email: {
      label: 'E-Mail',
      placeholder: 'name@beispiel.de',
      requiredError: 'Bitte gib deine E-Mail-Adresse ein.',
      blockedDomainError: 'Bitte nutze keine Test- oder Wegwerfadresse.',
      emailError: 'Bitte gib eine gueltige E-Mail-Adresse ein.',
    },
    subject: {
      label: 'Betreff',
      placeholder: 'Worum geht es?',
      requiredError: 'Bitte gib einen Betreff ein.',
      maxlengthError: 'Der Betreff darf maximal 100 Zeichen lang sein.',
    },
    message: {
      label: 'Nachricht',
      placeholder: 'Erzähle mir, worum es geht.',
      requiredError: 'Bitte gib eine Nachricht ein.',
      minlengthError: 'Die Nachricht muss mindestens 10 Zeichen lang sein.',
      maxlengthError: 'Die Nachricht darf maximal 800 Zeichen lang sein.',
      counterSuffix: 'Zeichen',
    },
    consentError: 'Bitte bestaetige den Datenschutzhinweis.',
  },
} as const;
