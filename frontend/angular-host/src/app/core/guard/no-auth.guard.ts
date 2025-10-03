import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Um guard que permite a ativação apenas para usuários não autenticados.
 * Se o usuário já estiver autenticado, ele o redireciona para a página raiz/dashboard.
 * É tipicamente usado para rotas como páginas de login ou registro.
 * @param route O snapshot da rota ativada.
 * @param state O snapshot do estado do roteador.
 * @returns `true` se o usuário não estiver autenticado, caso contrário `false` após o redirecionamento.
 */
export const NoAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
