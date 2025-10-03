import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor que adiciona o token JWT de autenticação
 * a todas as requisições HTTP enviadas para a API.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(clonedReq);
  }

  return next(req);
};
