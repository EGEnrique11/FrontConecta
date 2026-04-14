import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('[AuthInterceptor] Interceptando la solicitud', req.method, req.url);
  const authService = inject(AuthService);
  const token = authService.token;
  let cloned = req;
  //Si token existe se añade a la cabecera
  if(token){
    console.log('token añadido a la cabecera', token);
    // Clonamos la solicitud para no modificar la original
    cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }
  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403){
        console.warn('Solicitud no autorizada, cerrando sesión');
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
