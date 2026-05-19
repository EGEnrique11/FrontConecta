import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagoRequest } from '../models/pagos/pago.model';

@Injectable({
  providedIn: 'root'
})
export class PagoHttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/pagos';

  registrarPago(pago: PagoRequest): Observable<any> {
    return this.http.post(this.apiUrl, pago);
  }
}
