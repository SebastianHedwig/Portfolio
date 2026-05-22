export type TechStackLabelData = {
  letters: string[];
};

export type TechStackItemData = {
  alt: string;
  letters: string[];
  src: string;
};

export type TechStackTextBlockData = {
  containerClass: string;
  copyClass: string;
  copyLines: string[];
  eyebrow?: string;
  titleClass: string;
  titleLines: string[];
  titleTag: 'h2' | 'h3';
};

export type TechStackGroupVariant = 'core' | 'main' | 'extended';

export type TechStackGroupData = {
  groupLabel: TechStackLabelData;
  items: TechStackItemData[];
  variant: TechStackGroupVariant;
};
