import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // Redireciona a raiz do site para a página de login
    path: '',
    redirectTo: 'auth/login',
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
            remoteName: 'angular-authentication',
            exposedModule: './LoginUser',
          }).then((m) => m.LoginUserIndex),
      },
      // Futuramente, a rota de cadastro pode ser adicionada aqui
      // { path: 'register', loadComponent: () => ... }
    ],
  },
];
