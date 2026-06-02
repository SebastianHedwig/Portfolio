import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { LanguageStore } from '../../i18n/language.store';
import { type AppLanguage, DEFAULT_APP_LANGUAGE, isAppLanguage } from '../../i18n/language.model';

const SITE_URL = 'https://sebastian-hedwig.de';
const SITE_NAME = 'Sebastian Hedwig';
const PERSON_PROFILES = [
  'https://github.com/SebastianHedwig',
  'https://www.xing.com/profile/Sebastian_Hedwig038158',
] as const;
const SOCIAL_PREVIEW_IMAGES: Record<AppLanguage, string> = {
  de: `${SITE_URL}/assets/images/social/portfolio-social-preview-de.jpg`,
  en: `${SITE_URL}/assets/images/social/portfolio-social-preview-en.jpg`,
};
const SOCIAL_PREVIEW_IMAGE_ALT: Record<AppLanguage, string> = {
  de: 'Portfolio-Vorschau von Sebastian Hedwig',
  en: 'Portfolio preview of Sebastian Hedwig',
};
const SOCIAL_PREVIEW_IMAGE_WIDTH = '1200';
const SOCIAL_PREVIEW_IMAGE_HEIGHT = '630';
const SOCIAL_PREVIEW_IMAGE_TYPE = 'image/jpeg';
const HERO_IMAGE_PRELOADS = [
  {
    href: '/assets/images/portraits/sebastian-portrait-1200.webp',
    media: '(max-width: 375px) and (max-height: 730px) and (orientation: portrait)',
    variant: 'compact-mobile',
  },
  {
    href: '/assets/images/portraits/sebastian-portrait-1600.webp',
    media: '(max-width: 760px) and (min-width: 376px) and (orientation: portrait), (max-width: 760px) and (min-height: 731px) and (orientation: portrait)',
    variant: 'mobile',
  },
  {
    href: '/assets/images/portraits/sebastian-portrait-1600.webp',
    media: '(min-width: 481px), (orientation: landscape)',
    variant: 'default',
  },
] as const;
const HERO_IMAGE_PRELOAD_SELECTOR = 'link[data-seo-hero-image-preload]';
const JSON_LD_ID = 'seo-jsonld';

interface SeoPage {
  title: string;
  description: string;
  path: string;
  robots: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly languageStore = inject(LanguageStore);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateSeo();
      }
    });
    effect(() => {
      this.languageStore.language();
      this.updateSeo();
    });
  }

  private updateSeo(): void {
    const language = this.resolveLanguage();
    const page = this.resolvePage(language);
    const url = this.buildUrl(language, page.path);
    this.document.documentElement.lang = language;
    this.document.documentElement.classList.add('notranslate');
    this.document.documentElement.setAttribute('translate', 'no');
    this.title.setTitle(page.title);
    this.updateMetaTags(page, language, url);
    this.updateCanonical(url);
    this.updateAlternates(page.path);
    this.updateHeroImagePreload(page.path);
    this.updateJsonLd(language);
  }

  private updateMetaTags(page: SeoPage, language: AppLanguage, url: string): void {
    const image = SOCIAL_PREVIEW_IMAGES[language];
    const imageAlt = SOCIAL_PREVIEW_IMAGE_ALT[language];
    this.setName('description', page.description);
    this.setName('robots', page.robots);
    this.updateTwitterTags(page, image, imageAlt);
    this.updateOpenGraphTags(page, language, url, image, imageAlt);
  }

  private updateTwitterTags(page: SeoPage, image: string, imageAlt: string): void {
    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', page.title);
    this.setName('twitter:description', page.description);
    this.setName('twitter:image', image);
    this.setName('twitter:image:alt', imageAlt);
  }

  private updateOpenGraphTags(
    page: SeoPage,
    language: AppLanguage,
    url: string,
    image: string,
    imageAlt: string,
  ): void {
    this.setProperty('og:type', 'website');
    this.setProperty('og:site_name', SITE_NAME);
    this.setProperty('og:title', page.title);
    this.setProperty('og:description', page.description);
    this.setProperty('og:url', url);
    this.setProperty('og:image', image);
    this.setProperty('og:image:secure_url', image);
    this.setProperty('og:image:type', SOCIAL_PREVIEW_IMAGE_TYPE);
    this.setProperty('og:image:width', SOCIAL_PREVIEW_IMAGE_WIDTH);
    this.setProperty('og:image:height', SOCIAL_PREVIEW_IMAGE_HEIGHT);
    this.setProperty('og:image:alt', imageAlt);
    this.setProperty('og:locale', language === 'de' ? 'de_DE' : 'en_US');
  }

  private resolveLanguage(): AppLanguage {
    const [, routeLanguage] = this.readPathSegments();
    return isAppLanguage(routeLanguage) ? routeLanguage : this.languageStore.language();
  }

  private resolvePage(language: AppLanguage): SeoPage {
    const path = this.resolvePagePath();
    return PAGE_META[language][path] ?? PAGE_META[language][''];
  }

  private resolvePagePath(): string {
    const [, routeLanguage, pagePath = ''] = this.readPathSegments();
    return isAppLanguage(routeLanguage) ? pagePath : '';
  }

  private readPathSegments(): string[] {
    return this.document.location.pathname.split('/');
  }

  private buildUrl(language: AppLanguage, path: string): string {
    return `${SITE_URL}/${language}${path ? `/${path}` : ''}`;
  }

  private updateCanonical(url: string): void {
    const link = this.readOrCreateLink('canonical');
    link.setAttribute('href', url);
  }

  private updateAlternates(path: string): void {
    this.removeAlternates();
    this.addAlternate('de', this.buildUrl('de', path));
    this.addAlternate('en', this.buildUrl('en', path));
    this.addAlternate('x-default', this.buildUrl(DEFAULT_APP_LANGUAGE, path));
  }

  private updateHeroImagePreload(path: string): void {
    if (path) {
      this.removeHeroImagePreload();
      return;
    }

    HERO_IMAGE_PRELOADS.forEach((preload) => {
      this.updateHeroImagePreloadLink(preload);
    });
  }

  private updateHeroImagePreloadLink(
    preload: (typeof HERO_IMAGE_PRELOADS)[number],
  ): void {
    const link = this.readOrCreateHeroImagePreload(preload.variant);
    link.setAttribute('href', preload.href);
    link.setAttribute('as', 'image');
    link.setAttribute('type', 'image/webp');
    link.setAttribute('fetchpriority', 'high');
    link.setAttribute('media', preload.media);
    link.setAttribute('data-seo-hero-image-preload', preload.variant);
    link.setAttribute('rel', 'preload');
  }

  private readOrCreateHeroImagePreload(variant: string): HTMLLinkElement {
    const existingLink = this.document.querySelector(
      `link[data-seo-hero-image-preload="${variant}"]`,
    ) as HTMLLinkElement | null;

    if (existingLink) {
      return existingLink;
    }

    const link = this.document.createElement('link');
    this.document.head.appendChild(link);
    return link;
  }

  private removeHeroImagePreload(): void {
    this.document.querySelectorAll(HERO_IMAGE_PRELOAD_SELECTOR).forEach((link) => link.remove());
  }

  private updateJsonLd(language: AppLanguage): void {
    const script = this.readOrCreateJsonLdScript();
    script.textContent = JSON.stringify(createStructuredData(language));
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }

  private readOrCreateLink(rel: string): HTMLLinkElement {
    return this.document.querySelector(`link[rel="${rel}"]`) ?? this.createLink(rel);
  }

  private createLink(rel: string): HTMLLinkElement {
    const link = this.document.createElement('link');
    link.setAttribute('rel', rel);
    this.document.head.appendChild(link);
    return link;
  }

  private removeAlternates(): void {
    this.document.querySelectorAll('link[data-seo-alternate="true"]').forEach((link) => link.remove());
  }

  private addAlternate(hreflang: string, href: string): void {
    const link = this.createLink('alternate');
    link.setAttribute('hreflang', hreflang);
    link.setAttribute('href', href);
    link.setAttribute('data-seo-alternate', 'true');
  }

  private readOrCreateJsonLdScript(): HTMLScriptElement {
    return (this.document.getElementById(JSON_LD_ID) as HTMLScriptElement | null)
      ?? this.createJsonLdScript();
  }

  private createJsonLdScript(): HTMLScriptElement {
    const script = this.document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    this.document.body.appendChild(script);
    return script;
  }
}

function createStructuredData(language: AppLanguage): object[] {
  return [createPersonData(language), createWebsiteData(language)];
}

function createPersonData(language: AppLanguage): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sebastian Hedwig',
    jobTitle: 'Frontend Developer',
    url: `${SITE_URL}/${language}`,
    image: SOCIAL_PREVIEW_IMAGES[language],
    sameAs: PERSON_PROFILES,
    address: createPostalAddress(),
  };
}

function createPostalAddress(): object {
  return {
    '@type': 'PostalAddress',
    addressLocality: 'Flörsheim am Main',
    addressRegion: 'Hessen',
    addressCountry: 'DE',
  };
}

function createWebsiteData(language: AppLanguage): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: language,
  };
}

const PAGE_META: Record<AppLanguage, Record<string, SeoPage>> = {
  de: {
    '': {
      title: 'Moderne Web Experiences, die überzeugen | Sebastian Hedwig',
      description: 'Portfolio von Sebastian Hedwig, Frontend Developer aus Flörsheim mit Fokus auf Angular, TypeScript, SCSS, Interaktion und Performance.',
      path: '',
      robots: 'index, follow',
    },
    impressum: {
      title: 'Impressum | Sebastian Hedwig',
      description: 'Impressum und Anbieterangaben von Sebastian Hedwig.',
      path: 'impressum',
      robots: 'noindex, follow',
    },
    datenschutz: {
      title: 'Datenschutzerklärung | Sebastian Hedwig',
      description: 'Datenschutzhinweise für das Portfolio von Sebastian Hedwig.',
      path: 'datenschutz',
      robots: 'noindex, follow',
    },
    fallstudien: {
      title: 'Case Study Portfolio | Sebastian Hedwig',
      description: 'Fallstudie zur Konzeption, Gestaltung und technischen Umsetzung des Portfolios von Sebastian Hedwig.',
      path: 'fallstudien',
      robots: 'index, follow',
    },
  },
  en: {
    '': {
      title: 'Modern Web Experiences That Convince | Sebastian Hedwig',
      description: 'Portfolio of Sebastian Hedwig, frontend developer based in Flörsheim with a focus on Angular, TypeScript, SCSS, interaction, and performance.',
      path: '',
      robots: 'index, follow',
    },
    impressum: {
      title: 'Imprint | Sebastian Hedwig',
      description: 'Imprint and provider information for Sebastian Hedwig.',
      path: 'impressum',
      robots: 'noindex, follow',
    },
    datenschutz: {
      title: 'Privacy Policy | Sebastian Hedwig',
      description: 'Privacy information for the portfolio of Sebastian Hedwig.',
      path: 'datenschutz',
      robots: 'noindex, follow',
    },
    fallstudien: {
      title: 'Portfolio Case Study | Sebastian Hedwig',
      description: 'German-language case study about the concept, design, and technical implementation of Sebastian Hedwig’s portfolio.',
      path: 'fallstudien',
      robots: 'index, follow',
    },
  },
};
