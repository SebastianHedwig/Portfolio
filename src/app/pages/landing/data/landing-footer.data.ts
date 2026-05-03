import { type AppLanguage } from '../../../i18n/language.model';
import { LANDING_FOOTER_CONTENT_DE } from './landing-footer.data.de';
import { LANDING_FOOTER_CONTENT_EN } from './landing-footer.data.en';

export interface LandingFooterIcon {
  alt: string;
  href?: string;
  letters: readonly string[];
  src: string;
}

export interface LandingFooterContent {
  brand: {
    ariaLabel: string;
    firstName: string;
    logoAlt: string;
    logoSrc: string;
    role: string;
    surnameInitial: string;
    surnameTail: string;
  };
  icons: readonly LandingFooterIcon[];
  imprintLabel: string;
  imprintPath: string;
  meta: {
    copyrightText: string;
    location: string;
  };
}

const LANDING_FOOTER_CONTENT_BY_LANGUAGE: Record<AppLanguage, LandingFooterContent> = {
  de: LANDING_FOOTER_CONTENT_DE,
  en: LANDING_FOOTER_CONTENT_EN,
};

export function getLandingFooterContent(language: AppLanguage): LandingFooterContent {
  return LANDING_FOOTER_CONTENT_BY_LANGUAGE[language];
}
