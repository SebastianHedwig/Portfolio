import { type AppLanguage } from '../../i18n/language.model';
import { CONTACT_CONTENT_DE } from './contact.data.de';
import { CONTACT_CONTENT_EN } from './contact.data.en';

export interface ContactFieldContent {
  blockedDomainError?: string;
  emailError?: string;
  label: string;
  maxlengthError?: string;
  minlengthError?: string;
  placeholder: string;
  requiredError: string;
}

export interface ContactFormContent {
  consentError: string;
  email: ContactFieldContent;
  message: ContactFieldContent & {
    counterSuffix: string;
  };
  name: ContactFieldContent;
  subject: ContactFieldContent;
}

export interface ContactContent {
  consentHref: string;
  consentLinkLabel: string;
  consentMiddle: string;
  consentPrefix: string;
  consentSuffix: string;
  copy: readonly string[];
  cvHref: string;
  cvLinkLabel: string;
  eyebrow: string;
  form: ContactFormContent;
  submitLabel: string;
  title: string;
}

const CONTACT_CONTENT_BY_LANGUAGE: Record<AppLanguage, ContactContent> = {
  de: CONTACT_CONTENT_DE,
  en: CONTACT_CONTENT_EN,
};

export function getContactContent(language: AppLanguage): ContactContent {
  return CONTACT_CONTENT_BY_LANGUAGE[language];
}
