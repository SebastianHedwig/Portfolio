import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

resetInitialScrollPosition();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

function resetInitialScrollPosition(): void {
  if (typeof window === 'undefined') return;

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  const scrollToTop = () => {
    if (hasNonHeroHash()) return;

    forceScrollToHeroStart();
  };

  scrollToTop();
  window.addEventListener('pageshow', scrollToTop, { once: true });
  window.addEventListener('load', scrollToTop, { once: true });
  window.addEventListener('beforeunload', scrollToTop);
}

function forceScrollToHeroStart(): void {
  const hero = document.getElementById('hero');
  const top = hero
    ? hero.getBoundingClientRect().top + window.scrollY
    : 0;

  window.scrollTo({ top, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;
}

function hasNonHeroHash(): boolean {
  const fragment = window.location.hash.replace(/^#/, '');
  return Boolean(fragment && fragment !== 'hero');
}
