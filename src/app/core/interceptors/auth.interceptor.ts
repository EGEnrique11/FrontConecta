import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.currentAccessToken;

  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh-token')) {
    return next(req);
  }

  let cloned = req;
  
  if (token) {
    cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      // Trigger refresh on 401 HTTP errors, preventing loop with itself
      if (error.status === 401 && !req.url.includes('/refresh-token')) {
        console.warn('[Interceptor] Status 401, engaging Token Refresh mechanism...');
        
        return authService.refreshToken().pipe(
          switchMap((response) => {
            const newReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${response.accessToken}`)
            });
            return next(newReq);
          }),
          catchError((refreshErr) => {
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
