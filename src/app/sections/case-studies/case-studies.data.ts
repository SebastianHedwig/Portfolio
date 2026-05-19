import { type AppLanguage } from '../../i18n/language.model';
import { CASE_STUDIES_CONTENT_DE } from './case-studies.data.de';
import { CASE_STUDIES_CONTENT_EN } from './case-studies.data.en';

export type CaseStudiesContent = {
  badge: string;
  eyebrow: string;
  title: string;
};

export function getCaseStudiesContent(language: AppLanguage): CaseStudiesContent {
  return language === 'de' ? CASE_STUDIES_CONTENT_DE : CASE_STUDIES_CONTENT_EN;
}
