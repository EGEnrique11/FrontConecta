import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface JwtPayload {
  permissions: string[];
  roles: string[];
  sub: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient, private router: Router) { }

  //Se envia las credendiales al back, se guarda el token y redirigie al menú
  login(credentials: { username: string; password: string; }): Observable<{token: string}> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => localStorage.setItem(this.TOKEN_KEY, response.token)),
        tap(() => this.router.navigate(['/menu']))
      );
  }

  logout(): void{
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/auth/login']);
  }

  get token(): string | null{
    return localStorage.getItem(this.TOKEN_KEY);
  }

  //Decodifica el payload del jwt
  private get payload(): JwtPayload | null{
    const token = this.token;
    if(!token) return null;
    try{
      const [, base64] = token.split('.');
      const json = atob(base64);
      return JSON.parse(json) as JwtPayload;
    } catch{
      return null;
    }
  }

  //Se comprueba si el token existe y no ha expirado
  isLoggedIn(): boolean{
    const data = this.payload;
    console.log('Payload:', data);
    return !!data && data.exp *1000 > Date.now();
  }
  //Se obtiene los roles definidos del token
  getRoles(): string[]{
    return this.payload?.roles ?? [];
  }
}
