import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../models/shared/page.model';
import { ReciboListDTO } from '../models/facturacion/facturacion.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturacionHttpService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  obtenerRecibosPorContrato(contratoId: number, estados: string[], page: number, size: number): Observable<Page<ReciboListDTO>>{
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

    estados.forEach(estado => {
      params = params.append('estados', estado);
    });
    return this.http.get<Page<ReciboListDTO>>(`${this.baseUrl}/facturacion/contratos/${contratoId}/recibos`,{params});
  }

  obtenerRecibosPorCliente(clienteId: number, page: number, size: number): Observable<Page<ReciboListDTO>>{
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
    return this.http.get<Page<ReciboListDTO>>(`${this.baseUrl}/facturacion/clientes/${clienteId}/recibos`,{params});
  }

  obtenerDocumentosPorCliente(clienteId: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/documentos/clientes/${clienteId}`);
  }
}
