import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { PagoHttpService } from '../../../core/infrastructure/pago-http.service';
import { PagoStateService } from '../../../features/pagos/pago-state.service';
import { PagoRequest } from '../../../core/models/pagos/pago.model';

@Component({
  selector: 'app-registro-pago',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-pago.component.html',
})
export default class RegistroPagoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly pagoHttpService = inject(PagoHttpService);
  readonly pagoState = inject(PagoStateService);
  private readonly router = inject(Router);

  form: FormGroup = this.fb.group({
    reciboId: [null, [Validators.required, Validators.min(1)]],
    montoPagado: [null, [Validators.required, Validators.min(0.01)]],
    metodoPago: ['', Validators.required],
    nroOperacion: [''],
    observaciones: ['']
  });

  metodosDePago = ['EFECTIVO', 'TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'YAPE', 'PLIN'];

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.currentUser();
    if (!currentUser?.id) {
      alert('Error de sesión: No se pudo identificar al empleado actual.');
      return;
    }

    this.pagoState.setLoading(true);

    const payload: PagoRequest = {
      ...this.form.value,
      empleadoRegistroId: currentUser.id
    };

    this.pagoHttpService.registrarPago(payload).subscribe({
      next: (res) => {
        this.pagoState.setLoading(false);
        alert('Pago registrado correctamente');
        this.form.reset();
        // Opcional: Navegar a otra vista o limpiar form
      },
      error: (err) => {
        this.pagoState.setLoading(false);
        console.error('Error al registrar el pago', err);
        alert(err.error?.error || 'Ocurrió un error al registrar el pago.');
      }
    });
  }
}
