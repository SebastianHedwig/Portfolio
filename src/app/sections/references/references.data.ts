import { type AppLanguage } from '../../i18n/language.model';
import { REFERENCES_CONTENT_DE } from './references.data.de';
import { REFERENCES_CONTENT_EN } from './references.data.en';

export interface ReferenceQuote {
  author: string;
  paragraphs: readonly string[];
  variant: 'primary' | 'secondary';
}

export interface ReferencesContent {
  eyebrow: string;
  quotes: readonly ReferenceQuote[];
  title: string;
}

const REFERENCES_CONTENT_BY_LANGUAGE: Record<AppLanguage, ReferencesContent> = {
  de: REFERENCES_CONTENT_DE,
  en: REFERENCES_CONTENT_EN,
};

export function getReferencesContent(language: AppLanguage): ReferencesContent {
  return REFERENCES_CONTENT_BY_LANGUAGE[language];
}
