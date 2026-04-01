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
    path: '**',
    redirectTo: '',
  },
];
