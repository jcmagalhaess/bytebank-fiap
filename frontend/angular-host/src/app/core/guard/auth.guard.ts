import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Um guard que permite a ativação apenas para usuários autenticados.
 * Se o usuário não estiver autenticado, ele o redireciona para a página de login.
 * @param route O snapshot da rota ativada.
 * @param state O snapshot do estado do roteador.
 * @returns `true` se o usuário estiver autenticado, caso contrário `false` após o redirecionamento.
 */
export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
