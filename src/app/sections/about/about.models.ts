export type AboutTextBlockData = {
  containerClass: string;
  copy: string;
  copyClass: string;
  title: string;
  titleClass: string;
  titleTag: 'h2' | 'p';
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
