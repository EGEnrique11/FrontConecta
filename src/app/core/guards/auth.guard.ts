import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = (route: Route, segments: UrlSegment[]): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if(authService.isLoggedIn()){
    return true;
  }
  //Redirige al login si no esta autenticado
  return router.createUrlTree(['/auth/login']);
};
