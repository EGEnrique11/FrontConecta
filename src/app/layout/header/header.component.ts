import { Component, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  collapsed = signal(false);
  isDarkMode = signal(false);
  constructor(private authService: AuthService) {}
  ngOnInit(){
    const storedDarkMode = localStorage.getItem('theme');
    this.isDarkMode.set(this.isDarkMode());
  }
  toggleDarkMode(){
    this.isDarkMode.update(current => !current);
    localStorage.setItem('theme', this.isDarkMode() ? 'dark': 'light');
    this.applyDarkModeClass(this.isDarkMode());
  }
  private applyDarkModeClass(enable: boolean){
    const body = document.body;
    if(enable){
      body.classList.add('dark-mode');
    }else{
      body.classList.remove('dark-mode');
    }
  }
  logout(): void{
    this.authService.logout();
  }
}
