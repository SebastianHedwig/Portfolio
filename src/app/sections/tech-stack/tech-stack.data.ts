import {
  type TechStackGroupData,
  type TechStackItemData,
  type TechStackLabelData,
  type TechStackTextBlockData,
} from './tech-stack.models';

function createLabel(text: string): TechStackLabelData {
  return { letters: Array.from(text) };
}

function createItem(alt: string, src: string): TechStackItemData {
  return { alt, letters: createLabel(alt).letters, src };
}

export const TECH_STACK_INTRO_BLOCK: TechStackTextBlockData = {
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
};

export const TECH_STACK_FOCUS_BLOCK: TechStackTextBlockData = {
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
};

export const TECH_STACK_LEARNING_ITEM = createItem(
  'Still learning',
  'assets/icons/tech-stack/Continually Learning.svg',
);

export const TECH_STACK_CORE_GROUP: TechStackGroupData = {
  variant: 'core',
  groupLabel: createLabel('Fundament'),
  items: [
    createItem('HTML', 'assets/icons/tech-stack/Html.svg'),
    createItem('CSS', 'assets/icons/tech-stack/Css.svg'),
    createItem('JavaScript', 'assets/icons/tech-stack/JavaScript.svg'),
  ],
};

export const TECH_STACK_MAIN_GROUP: TechStackGroupData = {
  variant: 'main',
  groupLabel: createLabel('Täglich im Einsatz'),
  items: [
    createItem('TypeScript', 'assets/icons/tech-stack/Typescript.svg'),
    createItem('Angular', 'assets/icons/tech-stack/Angular.svg'),
    createItem('SCSS', 'assets/icons/tech-stack/Sass.svg'),
  ],
};

export const TECH_STACK_EXTENDED_GROUP: TechStackGroupData = {
  variant: 'extended',
  groupLabel: createLabel('Unterstützende Erweiterungen'),
  items: [
    createItem('REST API', 'assets/icons/tech-stack/Api.svg'),
    createItem('Firebase', 'assets/icons/tech-stack/Firebase.svg'),
    createItem('Supabase', 'assets/icons/tech-stack/Supabase.svg'),
    createItem('Git', 'assets/icons/tech-stack/Git.svg'),
    createItem('Scrum', 'assets/icons/tech-stack/Scrum.svg'),
    createItem('VS Code', 'assets/icons/tech-stack/VSCode.svg'),
    createItem('Material Design', 'assets/icons/tech-stack/Material Design.svg'),
  ],
};
