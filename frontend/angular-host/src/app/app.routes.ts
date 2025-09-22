import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', // O caminho da URL para sua rota
    loadChildren: () =>
      import('./pages/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES), // O nome da classe do seu módulo remoto
  },
  {
    path: 'login', // O caminho da URL para sua rota
    loadComponent: () =>
      loadRemoteModule({
        remoteName: 'angular-authentication',
        exposedModule: './LoginUser', // O nome do módulo que você expôs no seu remote
      }).then((m) => m.LoginUserIndex), // O nome da classe do seu módulo remoto
  },
];
