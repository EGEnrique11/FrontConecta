import { Routes } from "@angular/router";
import { roleGuard } from "../../core/guards/role.guard";

export const CLIENTE_ROUTES: Routes = [
    {
        path: '',
        canMatch: [roleGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_VENDEDOR'] },
        loadComponent: () => import('./client-list/client-list.component')
    },
    {
        path: 'detalle/:id',
        canMatch: [roleGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_VENDEDOR'] },
        loadComponent: () => import('./client-detail/client-detail.component')
    }
];