import { Injectable, signal } from '@angular/core';
import { ClienteDto } from '../../../core/models/venta/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class VentaStateService {
  readonly clienteData = signal<ClienteDto | null>(null);

  setClienteData(cliente: ClienteDto): void {
    this.clienteData.set(cliente);
  }

  clearState(): void {
    this.clienteData.set(null);
  }
}
