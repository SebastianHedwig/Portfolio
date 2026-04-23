import { type AppLanguage } from '../../i18n/language.model';
import { PROJECTS_CONTENT_DE } from './projects.data.de';
import { PROJECTS_CONTENT_EN } from './projects.data.en';
import { type ProjectStageItemData } from './projects.models';

export interface ProjectsEntryContent {
  eyebrow: string;
  lead: string;
  titleLines: readonly string[];
}

export interface ProjectsContent {
  entry: ProjectsEntryContent;
  items: readonly ProjectStageItemData[];
  viewportAriaLabel: string;
}

const PROJECTS_CONTENT_BY_LANGUAGE: Record<AppLanguage, ProjectsContent> = {
  de: PROJECTS_CONTENT_DE,
  en: PROJECTS_CONTENT_EN,
};

export function getProjectsContent(language: AppLanguage): ProjectsContent {
  return PROJECTS_CONTENT_BY_LANGUAGE[language];
}
