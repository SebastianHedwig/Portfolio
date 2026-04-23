import { type AppLanguage } from '../../i18n/language.model';
import { TECH_STACK_CONTENT_DE } from './tech-stack.data.de';
import { TECH_STACK_CONTENT_EN } from './tech-stack.data.en';
import {
  type TechStackGroupData,
  type TechStackItemData,
  type TechStackTextBlockData,
} from './tech-stack.models';

export interface TechStackContent {
  coreGroup: TechStackGroupData;
  extendedGroup: TechStackGroupData;
  focusBlock: TechStackTextBlockData;
  introBlock: TechStackTextBlockData;
  learningItem: TechStackItemData;
  mainGroup: TechStackGroupData;
}

const TECH_STACK_CONTENT_BY_LANGUAGE: Record<AppLanguage, TechStackContent> = {
  de: TECH_STACK_CONTENT_DE,
  en: TECH_STACK_CONTENT_EN,
};

export function getTechStackContent(language: AppLanguage): TechStackContent {
  return TECH_STACK_CONTENT_BY_LANGUAGE[language];
}
