import { type AppLanguage } from '../../../../i18n/language.model';
import { DESKTOP_HEADER_CONTENT_DE } from './desktop-header.data.de';
import { DESKTOP_HEADER_CONTENT_EN } from './desktop-header.data.en';

export interface DesktopHeaderNavItem {
  href: string;
  label: string;
}

export interface DesktopHeaderBrand {
  ariaLabel: string;
  firstName: string;
  logoAlt: string;
  logoSrc: string;
  surnameInitial: string;
  surnameTail: string;
}

export interface DesktopHeaderContent {
  brand: DesktopHeaderBrand;
  languageToggleAriaLabel: string;
  languageToggleLabel: string;
  navAriaLabel: string;
  navItems: readonly DesktopHeaderNavItem[];
}

const DESKTOP_HEADER_CONTENT_BY_LANGUAGE: Record<AppLanguage, DesktopHeaderContent> = {
  de: DESKTOP_HEADER_CONTENT_DE,
  en: DESKTOP_HEADER_CONTENT_EN,
};

export function getDesktopHeaderContent(language: AppLanguage): DesktopHeaderContent {
  return DESKTOP_HEADER_CONTENT_BY_LANGUAGE[language];
}
