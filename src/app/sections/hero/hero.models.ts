export type HeroPrimaryActionData = {
  href: string;
  label: string;
};

export type HeroDescriptionData = {
  action: HeroPrimaryActionData;
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
