import { type AppLanguage } from '../../../../i18n/language.model';
import { LANDING_HEADER_CONTENT_DE } from './landing-header.data.de';
import { LANDING_HEADER_CONTENT_EN } from './landing-header.data.en';

export interface LandingHeaderNavItem {
  href: string;
  label: string;
}

export interface LandingHeaderBrand {
  ariaLabel: string;
  firstName: string;
  logoAlt: string;
  logoSrc: string;
  surnameInitial: string;
  surnameTail: string;
}

export interface LandingHeaderContent {
  brand: LandingHeaderBrand;
  languageToggleAriaLabel: string;
  languageToggleLabel: string;
  navAriaLabel: string;
  navItems: readonly LandingHeaderNavItem[];
}

const LANDING_HEADER_CONTENT_BY_LANGUAGE: Record<AppLanguage, LandingHeaderContent> = {
  de: LANDING_HEADER_CONTENT_DE,
  en: LANDING_HEADER_CONTENT_EN,
};

export function getLandingHeaderContent(language: AppLanguage): LandingHeaderContent {
  return LANDING_HEADER_CONTENT_BY_LANGUAGE[language];
}
