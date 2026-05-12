import { Component, computed, inject, input, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface MenuItem {
  path: string;
  icon: string;
  label: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterLink, RouterLinkActive],
  template: `
    <div class="flex flex-col h-full bg-[#008d92] text-white">
      <h2 class="text-xl font-bold px-4 py-4 mb-2 flex items-center gap-2 border-b border-white/20 overflow-hidden whitespace-nowrap"
          [class.justify-center]="collapsed()">
        @if (collapsed()) {
          <span class="text-2xl leading-none">❄</span>
        } @else {
          <span class="text-2xl leading-none text-[#0a6067]">❄</span>
          <span>Conecta SAC</span>
        }
      </h2>
      
      <ul class="p-2 flex flex-col w-full gap-2">
        @for(item of items(); track item.label){
          <li>
            <a class="hover:bg-black/20 w-full p-3 flex items-center gap-3 rounded-md transition-colors"
               [routerLink]="item.path"
               routerLinkActive="bg-[#0a6067] shadow-inner font-semibold"
               [class.justify-center]="collapsed()"
               [class.px-0]="collapsed()"
               title="{{item.label}}">
              
              <mat-icon class="!text-[22px] !size-[22px]">{{item.icon}}</mat-icon>
              
              @if (!collapsed()) {
                <span class="text-sm whitespace-nowrap">{{item.label}}</span>
              }
            </a>
          </li>
        }
      </ul>
    </div>
  `
})
export class SidebarComponent {
  private authService = inject(AuthService);
  collapsed = input.required<boolean>();
  private allMenus: MenuItem[] =[
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard', roles: ['ROLE_ADMIN', 'ROLE_DEVELOPER']},
    { path: '/venta/registro', icon: 'shopping_cart', label: 'Ventas', roles: ['ROLE_ADMIN', 'ROLE_DEVELOPER', 'ROLE_VENDEDOR']},
    { path: '/despacho', icon: 'local_shipping', label: 'Despacho', roles: ['ROLE_ADMIN', 'ROLE_DEVELOPER', 'ROLE_TECNICO']},
    { path: '/facturacion', icon: 'receipt', label: 'Facturación', roles: ['ROLE_ADMIN', 'ROLE_DEVELOPER']},
    { path: '/cliente', icon: 'people', label: 'Clientes', roles: ['ROLE_ADMIN', 'ROLE_DEVELOPER', 'ROLE_VENDEDOR']},
    { path: '/empleados', icon: 'manage_accounts', label: 'Empleados', roles: ['ROLE_ADMIN', 'ROLE_DEVELOPER']},
    { path: '/control', icon: 'admin_panel_settings', label: 'Panel Activos', roles: ['ROLE_ADMIN', 'ROLE_DEVELOPER']}
  ];

  items = computed(()=> {
    const userRoles = this.authService.userRoles();
    return this.allMenus.filter(menu => menu.roles.some(rol => userRoles.includes(rol)));
  });
  
}
