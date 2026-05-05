import {
  type TechStackItemData,
  type TechStackLabelData,
} from './tech-stack.models';
import { type TechStackContent } from './tech-stack.data';

function createLabel(text: string): TechStackLabelData {
  return { letters: Array.from(text) };
}

function createItem(alt: string, src: string): TechStackItemData {
  return { alt, letters: createLabel(alt).letters, src };
}

export const TECH_STACK_CONTENT_EN: TechStackContent = {
  introBlock: {
    containerClass: 'tech-stage__intro',
    eyebrow: 'Tech Stack',
    titleClass: 'tech-stage__headline',
    titleLines: [
      'Technology is a tool.',
      "Its value depends on how it's a applied.",
    ],
    titleTag: 'h2',
    copyClass: 'tech-stage__copy',
    copyLines: [
      'I do not work with as many tools as possible,',
      'but with the right ones — intentionally chosen',
      'and deliberately applied.',
    ],
  },
  focusBlock: {
    containerClass: 'tech-stage__focus',
    titleClass: 'tech-stage__subheadline',
    titleLines: ['Less is more.'],
    titleTag: 'h3',
    copyClass: 'tech-stage__copy tech-stage__copy--compact',
    copyLines: [
      'A thoughtful, reduced stack',
      'leads to better results',
      'than complex setups without direction.',
    ],
  },
  learningItem: createItem(
    'Still learning',
    'assets/icons/tech-stack/Continually Learning.svg',
  ),
  plannedStack: {
    title: 'Planned stack',
    items: [
      createItem('Vue.js', 'assets/icons/tech-stack/Vue Js.svg'),
      createItem('React', 'assets/icons/tech-stack/React.svg'),
      createItem('Python', 'assets/icons/tech-stack/Python.svg'),
    ],
  },
  coreGroup: {
    variant: 'core',
    groupLabel: createLabel('Foundation'),
    items: [
      createItem('HTML', 'assets/icons/tech-stack/Html.svg'),
      createItem('CSS', 'assets/icons/tech-stack/Css.svg'),
      createItem('JavaScript', 'assets/icons/tech-stack/JavaScript.svg'),
    ],
  },
  mainGroup: {
    variant: 'main',
    groupLabel: createLabel('Daily tools'),
    items: [
      createItem('TypeScript', 'assets/icons/tech-stack/Typescript.svg'),
      createItem('Angular', 'assets/icons/tech-stack/Angular.svg'),
      createItem('SCSS', 'assets/icons/tech-stack/Sass.svg'),
    ],
  },
  extendedGroup: {
    variant: 'extended',
    groupLabel: createLabel('Supporting tools'),
    items: [
      createItem('REST API', 'assets/icons/tech-stack/Api.svg'),
      createItem('Firebase', 'assets/icons/tech-stack/Firebase.svg'),
      createItem('Supabase', 'assets/icons/tech-stack/Supabase.svg'),
      createItem('Git', 'assets/icons/tech-stack/Git.svg'),
      createItem('Scrum', 'assets/icons/tech-stack/Scrum.svg'),
      createItem('VS Code', 'assets/icons/tech-stack/VSCode.svg'),
      createItem('Figma', 'assets/icons/tech-stack/Figma.svg'),
      createItem('Three.js', 'assets/icons/tech-stack/ThreeJS.svg'),
      createItem('Material Design', 'assets/icons/tech-stack/Material Design.svg'),
    ],
  },
} as const;
