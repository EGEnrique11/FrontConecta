import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagoRequest } from '../models/pagos/pago.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoHttpService {
  private readonly http = inject(HttpClient);
  //private readonly baseUrl = '/api/v1/pagos';
  private readonly baseUrl = environment.apiUrl;

  registrarPago(pago: PagoRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/pagos`, pago);
    //antes: return this.http.post(this.baseUrl`, pago);
    //antes: 
  }
}
