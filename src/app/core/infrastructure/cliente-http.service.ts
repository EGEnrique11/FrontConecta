import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../models/shared/page.model';
import { ClienteDto, DeudaResponse } from '../models/shared/cliente.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteHttpService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  buscarClientesPaginados(criterio: string, valor: string, page: number, size: number): Observable<Page<ClienteDto>>{
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
    if (valor && valor.trim() != ''){
      switch (criterio){
        case 'NOMBRE':
          params = params.set('nombres', valor);
          break;
        case 'DOCUMENTO':
          params = params.set('documento', valor);
          break;
        case 'CELULAR':
          params = params.set('celular', valor);
          break;
        case 'CODIGO':
          if (!isNaN(Number(valor))){
            params = params.set('id', valor);
            break;
          }
      }
    }
    return this.http.get<Page<ClienteDto>>(`${this.baseUrl}/clientes`,{params});
  }

  obtenerClientePorId(id: number): Observable<ClienteDto>{
    return this.http.get<ClienteDto>(`${this.baseUrl}/clientes/${id}`);
  }
  verificarDeuda(clienteId: number): Observable<DeudaResponse> {
    return this.http.get<DeudaResponse>(`${this.baseUrl}/clientes/${clienteId}/tiene-deuda`);
  }

  actualizarContacto(id: number, datos: { correo: string, celular: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/clientes/${id}/contacto`, datos);
  }

  obtenerContratosPorCliente(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/contratos/cliente/${clienteId}`);
  }
}
