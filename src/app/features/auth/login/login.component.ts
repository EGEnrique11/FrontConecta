import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);

  // Signals
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal<boolean>(false);

  // Form
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  togglePassword(): void {
    this.showPassword.update(val => !val);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    const formValues = this.loginForm.value;

    this.authService.login(formValues).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackbar.open('Inicio de sesión exitoso', 'Cerrar', {
          duration: 3000,
          panelClass: ['bg-green-500', 'text-white']
        });
        this.router.navigate(['/menu']); // or where dashboard / main is located
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Usuario o contraseña inválidos.');
        console.error('Login error', error);
      }
    });
  }
}
