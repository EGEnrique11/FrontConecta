import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

export const DESPACHO_ROUTES: Routes = [
  {
    path: 'admin',
    canMatch: [roleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_DEVELOPER'] },
    loadComponent: () => import('./admin-board/admin-board.component')
  },
  {
    path: 'mi-ruta',
    canMatch: [roleGuard],
    data: { roles: ['ROLE_TECNICO'] },
    loadComponent: () => import('./tech-agenda/tech-agenda.component')
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      const authService = inject(AuthService);
      const roles = authService.userRoles();
      if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_DEVELOPER')){
        return 'admin';
      }
      if (roles.includes('ROLE_TECNICO')){
        return 'mi-ruta';
      }
      return '/menu';
    }
  }
];
