import { type AppLanguage } from '../../i18n/language.model';
import { IMPRINT_CONTENT_DE } from './imprint.data.de';
import { IMPRINT_CONTENT_EN } from './imprint.data.en';

export interface LegalPageSection {
  blocks?: readonly LegalPageBlock[];
  paragraphs: readonly string[];
  title: string;
}

export type LegalPageBlock =
  | {
      text: string;
      type: 'paragraph';
    }
  | {
      level: 3 | 4;
      text: string;
      type: 'heading';
    }
  | {
      items: readonly string[];
      type: 'list';
    }
  | {
      href: string;
      label: string;
      text: string;
      type: 'source';
    };

export interface LegalPageContent {
  closeLabel: string;
  eyebrow: string;
  lead: string;
  sections: readonly LegalPageSection[];
  title: string;
}

export function getLegalPageBlockTrackKey(block: LegalPageBlock): string {
  switch (block.type) {
    case 'heading':
      return `${block.type}:${block.level}:${block.text}`;
    case 'paragraph':
      return `${block.type}:${block.text}`;
    case 'list':
      return `${block.type}:${block.items.join('|')}`;
    case 'source':
      return `${block.type}:${block.href}:${block.text}`;
  }
}

const IMPRINT_CONTENT_BY_LANGUAGE: Record<AppLanguage, LegalPageContent> = {
  de: IMPRINT_CONTENT_DE,
  en: IMPRINT_CONTENT_EN,
};

export function getImprintContent(language: AppLanguage): LegalPageContent {
  return IMPRINT_CONTENT_BY_LANGUAGE[language];
}
