import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
    ResumenDashboard, 
    FinanzasDeudaIngreso, 
    EfectividadMora, 
    TasaInstalacion, 
    CrecimientoMensual, 
    ProductividadTecnica, 
    RendimientoVendedor 
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardHttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1/dashboard';

  getResumen(): Observable<ResumenDashboard> {
    return this.http.get<ResumenDashboard>(`${this.baseUrl}/resumen`);
  }

  getFinanzasIngresosVsDeuda(): Observable<FinanzasDeudaIngreso> {
    return this.http.get<FinanzasDeudaIngreso>(`${this.baseUrl}/finanzas/ingresos-vs-deuda`);
  }

  getFinanzasEfectividad(): Observable<EfectividadMora> {
    return this.http.get<EfectividadMora>(`${this.baseUrl}/finanzas/efectividad`);
  }

  getOperacionesTasaInstalacion(): Observable<TasaInstalacion> {
    return this.http.get<TasaInstalacion>(`${this.baseUrl}/operaciones/tasa-instalacion`);
  }

  getRendimientoCrecimiento(): Observable<CrecimientoMensual[]> {
    return this.http.get<CrecimientoMensual[]>(`${this.baseUrl}/rendimiento/crecimiento`);
  }

  getOperacionesProductividad(): Observable<ProductividadTecnica[]> {
    return this.http.get<ProductividadTecnica[]>(`${this.baseUrl}/operaciones/productividad`);
  }

  getRendimientoVendedores(inicio: string, fin: string): Observable<RendimientoVendedor[]> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<RendimientoVendedor[]>(`${this.baseUrl}/rendimiento/vendedores`, { params });
  }

  getInstalacionesEstados(inicio: string, fin: string, estado?: string): Observable<Record<string, number>> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<Record<string, number>>(`${this.baseUrl}/operaciones/instalaciones-estados`, { params });
  }
}
