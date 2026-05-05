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

export const TECH_STACK_CONTENT_DE: TechStackContent = {
  introBlock: {
    containerClass: 'tech-stage__intro',
    eyebrow: 'Tech Stack',
    titleClass: 'tech-stage__headline',
    titleLines: [
      'Technologie ist Werkzeug.',
      'Ihr Nutzen entsteht durch die Art der Anwendung.',
    ],
    titleTag: 'h2',
    copyClass: 'tech-stage__copy',
    copyLines: [
      'Ich arbeite nicht mit möglichst vielen Tools,',
      'sondern mit den richtigen — sinnvoll gewählt',
      'und bewusst eingesetzt.',
    ],
  },
  focusBlock: {
    containerClass: 'tech-stage__focus',
    titleClass: 'tech-stage__subheadline',
    titleLines: ['Weniger ist mehr.'],
    titleTag: 'h3',
    copyClass: 'tech-stage__copy tech-stage__copy--compact',
    copyLines: [
      'Ein durchdachter, reduzierter Stack',
      'führt zu besseren Ergebnissen',
      'als komplexe Setups ohne Richtung.',
    ],
  },
  learningItem: createItem(
    'Still learning',
    'assets/icons/tech-stack/Continually Learning.svg',
  ),
  plannedStack: {
    title: 'Geplanter Stack',
    items: [
      createItem('Vue.js', 'assets/icons/tech-stack/Vue Js.svg'),
      createItem('React', 'assets/icons/tech-stack/React.svg'),
      createItem('Python', 'assets/icons/tech-stack/Python.svg'),
    ],
  },
  coreGroup: {
    variant: 'core',
    groupLabel: createLabel('Fundament'),
    items: [
      createItem('HTML', 'assets/icons/tech-stack/Html.svg'),
      createItem('CSS', 'assets/icons/tech-stack/Css.svg'),
      createItem('JavaScript', 'assets/icons/tech-stack/JavaScript.svg'),
    ],
  },
  mainGroup: {
    variant: 'main',
    groupLabel: createLabel('Täglich im Einsatz'),
    items: [
      createItem('TypeScript', 'assets/icons/tech-stack/Typescript.svg'),
      createItem('Angular', 'assets/icons/tech-stack/Angular.svg'),
      createItem('SCSS', 'assets/icons/tech-stack/Sass.svg'),
    ],
  },
  extendedGroup: {
    variant: 'extended',
    groupLabel: createLabel('Unterstützende Erweiterungen'),
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
