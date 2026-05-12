import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanMatchFn = (route: Route, segments: UrlSegment[]): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data?.['roles'] as string[] || [];

  const userRoles = authService.userRoles();
  const hasRole = requiredRoles.some(r => userRoles.includes(r));
  if(hasRole){
    return true;
  }
  //Redirigir
  return router.createUrlTree(['/auth/login']);
};
