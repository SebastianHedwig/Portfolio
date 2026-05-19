import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';

const languageParams = async () => [
  { lang: 'de' },
  { lang: 'en' },
];

export const serverRoutes: ServerRoute[] = [
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    getPrerenderParams: languageParams,
  },
  {
    path: ':lang/impressum',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    getPrerenderParams: languageParams,
  },
  {
    path: ':lang/datenschutz',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    getPrerenderParams: languageParams,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
