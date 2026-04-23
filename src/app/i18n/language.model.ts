export const APP_LANGUAGES = ['de', 'en'] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number];

export const DEFAULT_APP_LANGUAGE: AppLanguage = 'de';

export function isAppLanguage(value: string | null | undefined): value is AppLanguage {
  return value === 'de' || value === 'en';
}
