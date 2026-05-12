import { Component, output, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
  <mat-toolbar class="shadow-sm bg-white text-[#0a6067] flex justify-between h-16">
    <button mat-icon-button (click)="toggleSidebar.emit()" aria-label="Toggle Sidebar">
      <mat-icon>menu</mat-icon>
    </button>
    
    <div class="flex items-center gap-4 pr-4">
      <div class="flex flex-col text-right">
        <span class="text-sm font-semibold leading-tight text-[#0a6067]">{{ authService.currentUser()?.username || 'Usuario' }}</span>
        <span class="text-xs leading-none text-gray-500">{{ formattedRoles }}</span>
      </div>
      <button mat-icon-button class="!text-red-500 hover:bg-red-50" (click)="authService.logout()" title="Cerrar Sesión">
        <mat-icon>logout</mat-icon>
      </button>
    </div>
  </mat-toolbar>
  `
})
export class HeaderComponent {
  toggleSidebar = output<void>();
  authService = inject(AuthService);

  get formattedRoles(): string {
    const roles = this.authService.userRoles();
    if (!roles || roles.length === 0) return 'ROL';
    return roles.join(', ').replace(/ROLE_/g, '');
  }
}
