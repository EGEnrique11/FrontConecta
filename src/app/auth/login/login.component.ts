import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar){}

  togglePassword(): void{
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.authService.login({username: this.username, password: this.password}).subscribe({
      next: () => {
        this.snackbar.open("Inicio de sesión exitoso", "Cerrar", {
          duration: 3000,
        panelClass: ['bg-green-500', 'text-white']
        });
      },
      error: () => {
        this.snackbar.open('Usuario o contraseña inválidos', 'Cerrar',{
          duration: 3000,
          panelClass: ['bg-red-500', 'text-white']
        });
      }
    });
  }
}
