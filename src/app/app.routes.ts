import { Routes } from '@angular/router';

import { PreferredLanguageRedirectComponent } from './i18n/preferred-language-redirect.component';
import { languageMatcher, syncLanguageFromRouteGuard } from './i18n/language-routing';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PreferredLanguageRedirectComponent,
  },
  {
    matcher: languageMatcher,
    canActivateChild: [syncLanguageFromRouteGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/landing/landing.component').then(
            (module) => module.LandingComponent,
          ),
      },
      {
        path: 'impressum',
        loadComponent: () =>
          import('./pages/imprint/imprint.component').then(
            (module) => module.ImprintComponent,
          ),
      },
      {
        path: 'datenschutz',
        loadComponent: () =>
          import('./pages/privacy/privacy.component').then(
            (module) => module.PrivacyComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    component: PreferredLanguageRedirectComponent,
  },
];
