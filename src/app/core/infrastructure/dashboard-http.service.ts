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

  getResumen(inicio: string, fin: string): Observable<ResumenDashboard> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ResumenDashboard>(`${this.baseUrl}/resumen`, { params });
  }

  getFinanzasIngresosVsDeuda(inicio: string, fin: string): Observable<FinanzasDeudaIngreso> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<FinanzasDeudaIngreso>(`${this.baseUrl}/finanzas/ingresos-vs-deuda`, { params });
  }

  getFinanzasEfectividad(inicio: string, fin: string): Observable<EfectividadMora> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<EfectividadMora>(`${this.baseUrl}/finanzas/efectividad`, { params });
  }

  getOperacionesTasaInstalacion(inicio: string, fin: string): Observable<TasaInstalacion> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<TasaInstalacion>(`${this.baseUrl}/operaciones/tasa-instalacion`, { params });
  }

  getRendimientoCrecimiento(inicio: string, fin: string): Observable<CrecimientoMensual[]> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<CrecimientoMensual[]>(`${this.baseUrl}/rendimiento/crecimiento`, { params });
  }

  getOperacionesProductividad(inicio: string, fin: string): Observable<ProductividadTecnica[]> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ProductividadTecnica[]>(`${this.baseUrl}/operaciones/productividad`, { params });
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

  // --- Exportación a Excel ---
  private readonly reportesUrl = 'http://localhost:8080/api/v1/documentos/reportes';

  exportarProductividadExcel(inicio: string, fin: string): Observable<Blob> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get(`${this.reportesUrl}/productividad/excel`, { 
      params, 
      responseType: 'blob' as 'json' 
    }) as unknown as Observable<Blob>;
  }

  exportarVendedoresExcel(inicio: string, fin: string): Observable<Blob> {
    let params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get(`${this.reportesUrl}/vendedores/excel`, { 
      params, 
      responseType: 'blob' as 'json' 
    }) as unknown as Observable<Blob>;
  }
}
