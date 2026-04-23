import { inject } from '@angular/core';
import {
  type ActivatedRouteSnapshot,
  type CanActivateChildFn,
  type Route,
  type UrlSegment,
  type UrlSegmentGroup,
  Router,
} from '@angular/router';

import { LanguageStore } from './language.store';
import { isAppLanguage, type AppLanguage } from './language.model';

export function languageMatcher(
  segments: UrlSegment[],
  _group: UrlSegmentGroup,
  _route: Route,
):
  | {
      consumed: UrlSegment[];
      posParams: { lang: UrlSegment };
    }
  | null {
  const [langSegment] = segments;

  if (!langSegment || !isAppLanguage(langSegment.path)) {
    return null;
  }

  return {
    consumed: [langSegment],
    posParams: {
      lang: langSegment,
    },
  };
}

export const syncLanguageFromRouteGuard: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
) => {
  const languageStore = inject(LanguageStore);
  const routeLanguage = resolveRouteLanguage(childRoute);

  if (routeLanguage) {
    languageStore.setLanguage(routeLanguage);
  }

  return true;
};

export function redirectToPreferredLanguage(): Promise<boolean> {
  const router = inject(Router);
  const languageStore = inject(LanguageStore);
  const preferredLanguage = languageStore.resolveInitialLanguage();

  languageStore.setLanguage(preferredLanguage);

  return router.navigateByUrl(languageStore.buildLocalizedPath(preferredLanguage), {
    replaceUrl: true,
  });
}

function resolveRouteLanguage(route: ActivatedRouteSnapshot): AppLanguage | null {
  const routeLanguage = route.paramMap.get('lang');

  if (isAppLanguage(routeLanguage)) {
    return routeLanguage;
  }

  const parentLanguage = route.parent?.paramMap.get('lang');

  return isAppLanguage(parentLanguage) ? parentLanguage : null;
}
