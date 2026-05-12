import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: number;
    username: string;
    roles: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'http://localhost:8080/api/v1/auth';
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'currentUser';

  // Private Signals state
  #accessToken = signal<string | null>(localStorage.getItem(this.ACCESS_TOKEN_KEY));
  #refreshToken = signal<string | null>(localStorage.getItem(this.REFRESH_TOKEN_KEY));
  #user = signal<AuthResponse['usuario'] | null>(
    localStorage.getItem(this.USER_KEY) ? JSON.parse(localStorage.getItem(this.USER_KEY)!) : null
  );

  // Computed public properties
  readonly isAuthenticated = computed(() => !!this.#accessToken());
  readonly currentUser = computed(() => this.#user());
  readonly userRoles = computed(() => this.#user()?.roles || []);

  get currentAccessToken(): string | null {
    return this.#accessToken();
  }

  // Refactored Login Process
  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        this.saveSession(response);
      })
    );
  }

  // Refresh Token flow
  refreshToken(): Observable<AuthResponse> {
    const rfToken = this.#refreshToken();
    if (!rfToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available in storage'));
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh-token`, { refreshToken: rfToken }).pipe(
      tap((response) => this.saveSession(response)),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    this.#accessToken.set(null);
    this.#refreshToken.set(null);
    this.#user.set(null);

    this.router.navigate(['/auth/login']);
  }

  private saveSession(response: AuthResponse) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.usuario));

    this.#accessToken.set(response.accessToken);
    this.#refreshToken.set(response.refreshToken);
    this.#user.set(response.usuario);
  }
}
