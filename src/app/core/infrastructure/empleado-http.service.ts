import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoHttpService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1';

  obtenerRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/roles`);
  }

  registrarEmpleado(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/empleados/`, payload);
  }

  obtenerEmpleadosPaginados(page: number, size: number, rol?: string, tipoDocumento?: string, criterio?: string, valor?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (rol) params = params.set('rol', rol);
    if (tipoDocumento) params = params.set('tipoDocumento', tipoDocumento);
    if (criterio) params = params.set('criterio', criterio);
    if (valor) params = params.set('valor', valor);

    return this.http.get<any>(`${this.baseUrl}/empleados`, { params });
  }
}
