import { type AppLanguage } from '../../i18n/language.model';
import { PRIVACY_CONTENT_DE } from './privacy.data.de';
import { PRIVACY_CONTENT_EN } from './privacy.data.en';
import { type LegalPageContent } from '../imprint/imprint.data';

const PRIVACY_CONTENT_BY_LANGUAGE: Record<AppLanguage, LegalPageContent> = {
  de: PRIVACY_CONTENT_DE,
  en: PRIVACY_CONTENT_EN,
};

export function getPrivacyContent(language: AppLanguage): LegalPageContent {
  return PRIVACY_CONTENT_BY_LANGUAGE[language];
}
