import { type LegalPageContent } from './imprint.data';

export const IMPRINT_CONTENT_EN: LegalPageContent = {
  closeLabel: 'Close',
  eyebrow: 'Legal',
  title: 'Imprint',
  lead: 'This page is prepared and will be completed with your final imprint text.',
  sections: [
    {
      title: 'Provider information',
      paragraphs: [
        'The final imprint details will be inserted here in the next step.',
        'At the moment, this area serves as a placeholder for name, address, contact details, and any other legally required information.',
      ],
    },
    {
      title: 'Contact',
      paragraphs: [
        'The binding contact section with e-mail address and any further mandatory details will be added here later.',
      ],
    },
    {
      title: 'Notes',
      paragraphs: [
        'As soon as the final text is available, this page content will be fully replaced while the layout can remain as it is.',
      ],
    },
  ],
} as const;
