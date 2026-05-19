import { Injectable, signal } from '@angular/core';
import { ClienteRegistrationDTO, ClienteDto } from '../../../core/models/shared/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class VentaStateService {
  readonly clienteData = signal<ClienteRegistrationDTO | null>(null);
  readonly clientePreCargado = signal<ClienteDto | null>(null);

  setClienteData(cliente: ClienteRegistrationDTO): void {
    this.clienteData.set(cliente);
  }

  setClientePreCargado(cliente: ClienteDto): void {
    this.clientePreCargado.set(cliente);
  }

  clearState(): void {
    this.clienteData.set(null);
    this.clientePreCargado.set(null);
  }
}
