import { inject } from '@angular/core';
import {
  type ActivatedRouteSnapshot,
  type CanActivateChildFn,
  type CanMatchFn,
  Router,
} from '@angular/router';

import { LanguageStore } from './language.store';
import { isAppLanguage, type AppLanguage } from './language.model';

export const validLanguageMatchGuard: CanMatchFn = (_route, segments) =>
  isAppLanguage(segments[0]?.path);

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
