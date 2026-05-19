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
        loadComponent: () => import('./features/auth/login/login.component'),
    },
    {
        path: '',
        canMatch: [authGuard],
        loadComponent: () => import('./core/layout/main-layout.component'),
        children: [
            {
                path: 'dashboard',
                canMatch: [roleGuard],
                data: {roles: ['ROLE_ADMIN', 'ROLE_DEVELOPER']},
                loadComponent: () => import('./pages/dashboard/dashboard.component')
            },
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
                path: 'clientes',
                loadChildren: () => import('./pages/clientes/clientes.routes').then(m => m.CLIENTE_ROUTES)
            },
            {
                path: 'empleados',
                canMatch: [roleGuard],
                data: {roles: ['ROLE_ADMIN', 'ROLE_DEVELOPER']},
                loadComponent: () => import('./pages/empleados/empleado-list/empleado-list.component')
            },
            {
                path: 'pago',
                canMatch: [roleGuard],
                data: {roles: ['ROLE_ADMIN']},
                loadComponent: () => import('./pages/pagos/registro-pago/registro-pago.component')
            },
            {
                path: 'despacho',
                loadChildren: () => import('./pages/despacho/despacho.routes').then(m => m.DESPACHO_ROUTES)
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
