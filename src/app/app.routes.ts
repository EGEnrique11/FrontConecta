import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth/login',
        loadComponent: () => import('./auth/login/login.component'),
    },
    {
        path: '',
        canMatch: [authGuard],
        loadComponent: () => import('./layout/main-nav/main-nav.component'),
        children: [
            {
                path: 'menu',
                loadComponent: () => import('./pages/menu/menu.component')
            },
            {
                path: 'venta/registro',
                loadComponent: () => import('./pages/ventas/client-form/client-form.component')
            },
            {
                path: 'venta/servicio',
                loadComponent: () => import('./pages/ventas/service-selection/service-selection.component')
            },
            {
                path: 'control',
                canMatch: [roleGuard],
                data: {roles: ['ROLE_ADMIN']},
                loadComponent: () => import('./pages/control/control.component')
            },
            {
                path: 'cliente',
                loadComponent: () => import('./pages/clientes/client-list/client-list.component')
            },
            {
                path: '',
                redirectTo: 'menu',
                pathMatch: 'full'
            }
        ]
    },

    {
        path: '**',
        redirectTo: 'menu'
    }
];
