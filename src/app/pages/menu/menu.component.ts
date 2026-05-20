import { Component, inject, computed } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export default class MenuComponent {
  authService = inject(AuthService);
  currentUser = this.authService.currentUser;
  
  hasAdminOrDeveloperRole = computed(() => {
    const roles = this.authService.userRoles();
    return roles.includes('ROLE_ADMIN') || roles.includes('ROLE_DEVELOPER');
  });
}
