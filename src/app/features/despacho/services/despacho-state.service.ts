import { Injectable, signal } from '@angular/core';
import { InstalacionPendienteDTO } from '../../../core/models/despacho/despacho.model';

export interface TecnicoBasico {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class DespachoStateService {
  readonly instalacionesPendientes = signal<InstalacionPendienteDTO[]>([]);
  readonly instalacionesDelDia = signal<InstalacionPendienteDTO[]>([]);
  readonly listaTecnicos = signal<TecnicoBasico[]>([]);

  setPendientes(pendientes: InstalacionPendienteDTO[]) {
    this.instalacionesPendientes.set(pendientes);
  }

  setDelDia(delDia: InstalacionPendienteDTO[]) {
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
