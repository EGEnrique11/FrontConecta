import { Injectable, signal } from '@angular/core';

export interface TecnicoBasico {
  id: number;
  nombre: string;
}

export interface InstalacionAgenda {
  id: number;
  contratoId: number;
  nombreCliente: string;
  direccionCompleta: string;
  fechaProgramada: string;
  franjaHoraria: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class DespachoStateService {
  readonly instalacionesPendientes = signal<InstalacionAgenda[]>([]);
  readonly instalacionesDelDia = signal<InstalacionAgenda[]>([]);
  readonly listaTecnicos = signal<TecnicoBasico[]>([]);

  setPendientes(pendientes: any[]) {
    this.instalacionesPendientes.set(pendientes);
  }

  setDelDia(delDia: any[]) {
    this.instalacionesDelDia.set(delDia);
  }

  setTecnicos(tecnicos: any[]) {
    this.listaTecnicos.set(tecnicos);
  }

  clearState() {
    this.instalacionesPendientes.set([]);
    this.instalacionesDelDia.set([]);
    this.listaTecnicos.set([]);
  }
}
