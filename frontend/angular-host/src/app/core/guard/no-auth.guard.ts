import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * NoAuthGuard como uma função. Impede que usuários autenticados acessem a página de login.
 */
export const NoAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('NoAuthGuard', authService.isAuthenticated());

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Redireciona para o dashboard se o usuário já estiver logado
  router.navigate(['/']);
  return false;
};
