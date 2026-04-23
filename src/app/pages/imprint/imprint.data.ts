import { type AppLanguage } from '../../i18n/language.model';
import { IMPRINT_CONTENT_DE } from './imprint.data.de';
import { IMPRINT_CONTENT_EN } from './imprint.data.en';

export interface LegalPageSection {
  paragraphs: readonly string[];
  title: string;
}

export interface LegalPageContent {
  closeLabel: string;
  eyebrow: string;
  lead: string;
  sections: readonly LegalPageSection[];
  title: string;
}

const IMPRINT_CONTENT_BY_LANGUAGE: Record<AppLanguage, LegalPageContent> = {
  de: IMPRINT_CONTENT_DE,
  en: IMPRINT_CONTENT_EN,
};

export function getImprintContent(language: AppLanguage): LegalPageContent {
  return IMPRINT_CONTENT_BY_LANGUAGE[language];
}
