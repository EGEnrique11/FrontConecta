import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
  <div class="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
    
    <app-sidebar 
      [collapsed]="isSidebarCollapsed()" 
      class="transition-all duration-300 ease-in-out shadow-xl z-20"
      [class.w-16]="isSidebarCollapsed()"
      [class.w-64]="!isSidebarCollapsed()">
    </app-sidebar>
    
    <div class="flex flex-col flex-1 w-full overflow-hidden">
      <app-header (toggleSidebar)="toggleSidebar()" class="z-10"></app-header>
      
      <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto w-full">
            <router-outlet></router-outlet>
        </div>
      </main>
    </div>

  </div>
  `
})
export default class MainLayoutComponent {
  isSidebarCollapsed = signal<boolean>(false);

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }
}
