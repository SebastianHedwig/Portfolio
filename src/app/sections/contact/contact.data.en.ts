import { type ContactContent } from './contact.data';

export const CONTACT_CONTENT_EN: ContactContent = {
  eyebrow: 'Contact',
  title: 'Ready to build something?',
  copy: [
    'If you have an idea or want to build something —\nlet’s talk.',
    'I care about clean, thoughtful solutions, keep developing continuously, and stay open to new challenges and collaboration.',
  ],
  cvLinkLabel: 'View resume (PDF)',
  cvHref: 'https://ceqznaimpbtixlgvypcy.supabase.co/storage/v1/object/public/cv/Lebenslauf_Hedwig_Sebastian.pdf',
  consentPrefix: 'I have read the ',
  consentLinkLabel: 'privacy policy',
  consentHref: 'datenschutz',
  consentMiddle: ' and agree to the processing',
  consentSuffix: 'of my data for contact purposes.',
  submitLabel: 'Send message',
  form: {
    name: {
      label: 'Name',
      placeholder: 'Your name',
      requiredError: 'Please enter your name.',
      maxlengthError: 'Your name must be 50 characters or fewer.',
    },
    email: {
      label: 'E-mail',
      placeholder: 'name@example.com',
      requiredError: 'Please enter your e-mail address.',
      blockedDomainError: 'Please do not use a test or disposable address.',
      emailError: 'Please enter a valid e-mail address.',
    },
    subject: {
      label: 'Subject',
      placeholder: 'What is it about?',
      requiredError: 'Please enter a subject.',
      maxlengthError: 'The subject must be 100 characters or fewer.',
    },
    message: {
      label: 'MESSAGE',
      placeholder: 'Tell me what this is about.',
      requiredError: 'Please enter a message.',
      minlengthError: 'Your message must be at least 10 characters long.',
      maxlengthError: 'Your message must be 800 characters or fewer.',
      counterSuffix: 'characters',
    },
    consentError: 'Please confirm the privacy notice.',
  },
} as const;
