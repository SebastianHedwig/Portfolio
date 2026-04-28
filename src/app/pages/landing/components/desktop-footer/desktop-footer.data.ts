import { type AppLanguage } from '../../../../i18n/language.model';
import { FOOTER_CONTENT_DE } from './desktop-footer.data.de';
import { FOOTER_CONTENT_EN } from './desktop-footer.data.en';

export interface FooterIcon {
  alt: string;
  href?: string;
  letters: readonly string[];
  src: string;
}

export interface FooterContent {
  brand: {
    ariaLabel: string;
    firstName: string;
    logoAlt: string;
    logoSrc: string;
    role: string;
    surnameInitial: string;
    surnameTail: string;
  };
  icons: readonly FooterIcon[];
  imprintLabel: string;
  imprintPath: string;
  meta: {
    copyrightText: string;
    location: string;
  };
}

const FOOTER_CONTENT_BY_LANGUAGE: Record<AppLanguage, FooterContent> = {
  de: FOOTER_CONTENT_DE,
  en: FOOTER_CONTENT_EN,
};

export function getFooterContent(language: AppLanguage): FooterContent {
  return FOOTER_CONTENT_BY_LANGUAGE[language];
}
