import { Routes } from '@angular/router';

export const routes: Routes = [
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
  {
    path: '**',
    redirectTo: '',
  },
];
