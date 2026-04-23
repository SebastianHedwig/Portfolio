import { type AppLanguage } from '../../i18n/language.model';
import { ABOUT_CONTENT_DE } from './about.data.de';
import { ABOUT_CONTENT_EN } from './about.data.en';
import { type AboutImageData, type AboutTextBlockData } from './about.models';

export interface AboutContent {
  contextCenter: AboutTextBlockData;
  contextLeft: AboutTextBlockData;
  contextRight: AboutTextBlockData;
  introLead: AboutTextBlockData;
  introSecondary: AboutTextBlockData;
  portrait: AboutImageData;
  viewportAriaLabel: string;
}

const ABOUT_CONTENT_BY_LANGUAGE: Record<AppLanguage, AboutContent> = {
  de: ABOUT_CONTENT_DE,
  en: ABOUT_CONTENT_EN,
};

export function getAboutContent(language: AppLanguage): AboutContent {
  return ABOUT_CONTENT_BY_LANGUAGE[language];
}
