import { type AppLanguage } from '../../i18n/language.model';
import { type LegalPageBlock, type LegalPageContent, type LegalPageSection } from '../imprint/imprint.data';
import { CASE_STUDY_PAGE_CONTENT_DE } from './case-studies.data.de';
import { CASE_STUDY_PAGE_CONTENT_EN } from './case-studies.data.en';

export type CaseStudyMetaItem = {
  href?: string;
  label: string;
  value: string;
};

export type CaseStudyMediaItem = {
  alt: string;
  dialogLabel: string;
  openLabel: string;
  src: string;
};

export type CaseStudyPageContent = LegalPageContent & {
  facts: readonly string[];
  factsTitle: string;
  media: {
    designIdea: CaseStudyMediaItem;
    wireframe: CaseStudyMediaItem;
  };
  meta: readonly CaseStudyMetaItem[];
  preview: {
    alt: string;
    src: string;
  };
};

const CASE_STUDY_CONTENT_BY_LANGUAGE: Record<AppLanguage, CaseStudyPageContent> = {
  de: CASE_STUDY_PAGE_CONTENT_DE,
  en: CASE_STUDY_PAGE_CONTENT_EN,
};

export function getCaseStudyPageContent(language: AppLanguage): CaseStudyPageContent {
  return CASE_STUDY_CONTENT_BY_LANGUAGE[language];
}

export function createCaseStudyContent(
  page: Omit<CaseStudyPageContent, 'sections'>,
  markdown: string,
): CaseStudyPageContent {
  return {
    ...page,
    sections: parseCaseStudyMarkdown(markdown),
  };
}

function parseCaseStudyMarkdown(markdown: string): readonly LegalPageSection[] {
  const sections: LegalPageSection[] = [];
  let currentSection: MutableLegalPageSection | null = null;
  let currentParagraph: string[] = [];

  const flushParagraph = (): void => {
    if (!currentSection || !currentParagraph.length) {
      return;
    }

    currentSection.blocks.push({
      text: currentParagraph.join(' '),
      type: 'paragraph',
    });
    currentParagraph = [];
  };

  markdown.trim().split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine === '---') {
      flushParagraph();
      return;
    }

    if (trimmedLine.startsWith('# ')) {
      flushParagraph();
      currentSection = {
        blocks: [],
        paragraphs: [],
        title: trimmedLine.slice(2),
      };
      sections.push(currentSection);
      return;
    }

    if (trimmedLine.startsWith('## ')) {
      flushParagraph();
      currentSection?.blocks.push({
        level: 3,
        text: trimmedLine.slice(3),
        type: 'heading',
      });
      return;
    }

    currentParagraph.push(trimmedLine);
  });

  flushParagraph();

  return sections;
}

type MutableLegalPageSection = {
  blocks: LegalPageBlock[];
  paragraphs: string[];
  title: string;
};
