import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    // A rota raiz agora redireciona para o dashboard
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    // Agrupa todas as rotas de autenticação
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          loadRemoteModule({
            remoteName: 'angular-remote',
            exposedModule: './LoginUser',
          }).then((m) => m.LoginUserIndex),
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
    canActivate: [authGuard], // Protege esta rota
    loadComponent: () =>
      import('./shared/components/page-container/page-container.component').then(
        (m) => m.PageContainerComponent
      ),
  },
];
