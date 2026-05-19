import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClienteDto } from '../../../../../core/models/shared/cliente.model';
import { ClienteHttpService } from '../../../../../core/infrastructure/cliente-http.service';
import { VentaStateService } from '../../../../../features/ventas/services/venta-state.service';

@Component({
  selector: 'app-tab-ofertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-ofertas.component.html',
  styleUrl: './tab-ofertas.component.css'
})
export class TabOfertasComponent implements OnInit {
  clienteData = input.required<ClienteDto>();
  
  deudaStatus = signal<{ tieneDeuda: boolean, mensaje: string }>({ tieneDeuda: false, mensaje: '' });
  isLoadingDeuda = signal<boolean>(true);

  private readonly clienteHttp = inject(ClienteHttpService);
  private readonly router = inject(Router);
  private readonly ventaStateService = inject(VentaStateService);

  ngOnInit(): void {
    this.verificarDeuda();
  }

  private verificarDeuda(): void {
    this.clienteHttp.verificarDeuda(this.clienteData().id).subscribe({
      next: (res) => {
        this.deudaStatus.set(res);
        this.isLoadingDeuda.set(false);
      },
      error: (err) => {
        console.error('Error al verificar deuda', err);
        // Fallback: asumimos que no tiene deuda o lo bloqueamos? Bloqueamos por seguridad o dejamos pasar?
        // En un sistema real dependería. Aquí permitimos que el UI refleje un error o asuma false.
        this.deudaStatus.set({ tieneDeuda: false, mensaje: 'No se pudo verificar la deuda' });
        this.isLoadingDeuda.set(false);
      }
    });
  }

  generarVenta(): void {
    if (this.deudaStatus().tieneDeuda) {
      return;
    }
    this.ventaStateService.setClientePreCargado(this.clienteData());
    this.router.navigate(['/venta/registro']);
  }
}
