export type HeroActionData = {
  href: string;
  label: string;
  modifierClass: string;
};

export type HeroDescriptionData = {
  actions: HeroActionData[];
  eyebrow: string;
  headlineLines: string[];
  text: string;
};

export type HeroIdentityData = {
  name: string;
  tagline: string;
};

export type HeroPortraitData = {
  alt: string;
  src: string;
};
