export type HeroPrimaryActionData = {
  href: string;
  label: string;
};

export type HeroDescriptionData = {
  action: HeroPrimaryActionData;
  eyebrow: string;
  headlineLines: string[];
  qualities: string;
  text: string;
  textDetail: string;
};

export type HeroIdentityData = {
  name: string;
  tagline: string;
};

export type HeroPortraitData = {
  alt: string;
  height: number;
  mobileWebpSrc: string;
  compactMobileWebpSrc: string;
  webpSrc: string;
  width: number;
};
