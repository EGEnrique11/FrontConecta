import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanMatchFn = (route: Route, segments: UrlSegment[]): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data?.['roles'] as string[] || [];

  const userRoles = authService.getRoles();
  const hasRole = requiredRoles.some(r => userRoles.includes(r));
  if(hasRole){
    return true;
  }
  //Redigir
  return router.createUrlTree(['/auth/login']);
};
