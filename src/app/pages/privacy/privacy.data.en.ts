import { type LegalPageContent } from '../imprint/imprint.data';

export const PRIVACY_CONTENT_EN: LegalPageContent = {
  closeLabel: 'Close',
  eyebrow: 'Legal',
  title: 'Privacy policy',
  lead: 'The structure is already in place. The final privacy text will then be inserted into this layout.',
  sections: [
    {
      title: 'Privacy at a glance',
      paragraphs: [
        'The final privacy policy text will be inserted here in the next step.',
        'At the moment, this area is intentionally set up as a placeholder so that structure and design are already prepared cleanly.',
      ],
    },
    {
      title: 'Processing of personal data',
      paragraphs: [
        'The specific body text regarding purpose, scope, legal basis, and storage duration of data processing will be added here later.',
      ],
    },
    {
      title: 'Contact form and technical services',
      paragraphs: [
        'As soon as you send me the final content, I will replace this section with the binding information about the form, hosting, and other services in use.',
      ],
    },
  ],
} as const;
