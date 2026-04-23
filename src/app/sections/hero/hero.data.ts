import { type AppLanguage } from '../../i18n/language.model';
import { HERO_CONTENT_DE } from './hero.data.de';
import { HERO_CONTENT_EN } from './hero.data.en';
import {
  type HeroDescriptionData,
  type HeroIdentityData,
  type HeroPortraitData,
} from './hero.models';

export interface HeroContent {
  description: HeroDescriptionData;
  identity: HeroIdentityData;
  portrait: HeroPortraitData;
  statementParts: readonly string[];
}

const HERO_CONTENT_BY_LANGUAGE: Record<AppLanguage, HeroContent> = {
  de: HERO_CONTENT_DE,
  en: HERO_CONTENT_EN,
};

export function getHeroContent(language: AppLanguage): HeroContent {
  return HERO_CONTENT_BY_LANGUAGE[language];
}
