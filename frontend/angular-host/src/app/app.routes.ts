import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { noAuthGuard } from './core/guard/no-auth.guard';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [noAuthGuard], // Impede que usuários logados acessem login/cadastro
    children: [
      {
        path: 'login',
        loadComponent: () =>
          loadRemoteModule({
            remoteName: 'angular-remote',
            exposedModule: './UserLogin',
          }).then((m) => m.UserLogin),
      },
      {
        path: 'register',
        loadComponent: () =>
          loadRemoteModule({
            remoteName: 'angular-remote',
            exposedModule: './UserRegistration',
          }).then((m) => m.UserRegistration),
      },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard], // Protege a rota do dashboard
    loadChildren: () =>
      import('./pages/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
];
