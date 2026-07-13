export type AboutTextBlockData = {
  containerClass: string;
  copy: string;
  mobileCopy?: string;
  copyClass: string;
  eyebrow?: string;
  eyebrowClass?: string;
  title: string;
  titleClass: string;
  titleTag: 'h2' | 'p';
  subtitle?: string;
  subtitleClass?: string;
  subtitleTag?: 'h2' | 'p';
  valueStatements?: AboutValueStatementData[];
};

export type AboutValueStatementData = {
  detail: string;
  lead: string;
};

export type AboutImageData = {
  alt: string;
  decoding: 'async' | 'auto' | 'sync';
  height: number;
  sizes: string;
  src: string;
  srcset: string;
  width: number;
};

export interface AboutStageVisualState {
  opacity: string;
  pointerEvents: string;
  transform: string;
  zIndex: string;
}
