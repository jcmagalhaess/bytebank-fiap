import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/user-login/user-login').then((c) => c.UserLogin),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/user-registration/user-registration').then((c) => c.UserRegistration),
  },
];
