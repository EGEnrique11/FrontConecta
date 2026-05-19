import { Injectable, signal } from '@angular/core';
import { ClienteDto } from '../../core/models/shared/cliente.model';
import { single } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteStateService {
  readonly clientes = signal<ClienteDto[]>([]);
  readonly isLoading = signal<boolean>(false);

  readonly totalElements = signal<number>(0);
  readonly pageSize = signal<number>(10);
  readonly pageIndex = signal<number>(0);

  readonly criterio = signal<string>('NOMBRE');
  readonly valorBusqueda = signal<string>('');
  
  setClientes(clientes: ClienteDto[]){
    this.clientes.set(clientes);
  }
  setLoading(isLoading: boolean){
    this.isLoading.set(isLoading);
  }
  setPagination(total: number, size: number, index: number){
    this.totalElements.set(total);
    this.pageSize.set(size);
    this.pageIndex.set(index);
  }
  setCriterio(criterio: string){
    this.criterio.set(criterio);
  }
  setValorBusqueda(valor: string){
    this.valorBusqueda.set(valor);
  }
  clearState(){
    this.clientes.set([]);
    this.totalElements.set(0);
    this.pageIndex.set(0);
    this.pageSize.set(10);
    this.valorBusqueda.set('');
    this.criterio.set('NOMBRE');
  }
}
