import { type AppLanguage } from '../../i18n/language.model';
import { CASE_STUDIES_CONTENT_DE } from './case-studies.data.de';
import { CASE_STUDIES_CONTENT_EN } from './case-studies.data.en';

export type CaseStudiesContent = {
  eyebrow: string;
  preview: {
    alt: string;
    chips: readonly string[];
    chipsLabel: string;
    cta: string;
    ctaHover: string;
    description: string;
    githubHref: string;
    githubLabel: string;
    image: string;
    label: string;
    studyHref: string;
    title: string;
  };
  title: string;
};

export function getCaseStudiesContent(language: AppLanguage): CaseStudiesContent {
  return language === 'de' ? CASE_STUDIES_CONTENT_DE : CASE_STUDIES_CONTENT_EN;
}
