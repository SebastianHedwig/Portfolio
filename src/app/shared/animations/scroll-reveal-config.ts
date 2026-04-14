export type RevealProfile = 'default' | 'tech' | 'tech-intro';

export interface ScrollRevealConfig {
  selector: string;
  start?: string;
  end?: string;
  trigger?: string;
  profile?: RevealProfile;
}
