import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasHttpService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1';

  getPlanesActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/catalogo/planes`);
  }

  buscarClientePorDni(dni: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/clientes/dni/${dni}`);
  }

  getPromocionesPorPlan(planId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/catalogo/promociones/plan/${planId}`);
  }

  getEfectosPorPromocion(promoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/catalogo/promociones/${promoId}/efectos`);
  }

  registrarVentaCompleta(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ventas`, payload);
  }
}
