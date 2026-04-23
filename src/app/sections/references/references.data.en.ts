import { type ReferencesContent } from './references.data';

export const REFERENCES_CONTENT_EN: ReferencesContent = {
  eyebrow: 'References',
  title: 'Voices',
  quotes: [
    {
      variant: 'primary',
      paragraphs: [
        '"Highly reliable and always on top of everything. You never have to worry that something will slip through. He has a strong sense of responsibility without seeming tense about it, which is honestly rare.',
        'He is simply a pleasant person to work with. Conversations come easily, collaboration feels straightforward, and his manner noticeably improves the team atmosphere.',
        'The kind of colleague you genuinely enjoy working with."',
      ],
      author: 'Daniel M. — Team colleague at Developer Akademie',
    },
    {
      variant: 'secondary',
      paragraphs: [
        '"An exceptionally committed leader who always gives full effort. He analyzes quickly and precisely, then follows through on solutions consistently.',
        'Always exemplary in his conduct and equally valued by supervisors, colleagues, and customers. He actively strengthens collaboration and puts the team above personal interests."',
      ],
      author: 'Dominic R. — Former supervisor',
    },
  ],
} as const;
