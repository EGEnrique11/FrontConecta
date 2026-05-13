import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DespachoHttpService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1';

  obtenerPendientes(fecha: string, franja: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/despacho/pendientes?fecha=${fecha}&franja=${franja}`);
  }

  asignarTecnico(instalacionId: number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/despacho/asignar/${instalacionId}`, dto);
  }

  // Se removió cambiarEstado ya que se reemplaza por completarInstalacion y cancelarInstalacion

  obtenerAgendaTecnico(mes: number, anio: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/despacho/tecnico/agenda?mes=${mes}&anio=${anio}`);
  }

  obtenerListaTecnicos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/empleados/rol/tecnico`);
  }

  buscarTecnicos(term: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/empleados/tecnicos/buscar?term=${term}`);
  }

  obtenerTurnos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/despacho/turnos`);
  }

  crearTurno(dto: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/despacho/turnos`, dto);
  }

  asignarTurnoATecnico(tecnicoId: number, turnoId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/empleados/${tecnicoId}/turno/${turnoId}`, {});
  }

  obtenerTurnoDeTecnico(tecnicoId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/despacho/turnos/tecnico/${tecnicoId}`);
  }

  obtenerBloquesPorTurno(turnoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/despacho/turnos/${turnoId}/bloques`);
  }

  crearBloque(turnoId: number, dto: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/despacho/turnos/${turnoId}/bloques`, dto);
  }

  obtenerEmpleadosPaginados(rol: string, page: number, size: number, criterio?: string, valor?: string): Observable<any> {
    let url = `${this.baseUrl}/empleados?rol=${rol}&page=${page}&size=${size}`;
    if (criterio && valor) {
      url += `&criterio=${criterio}&valor=${valor}`;
    }
    return this.http.get<any>(url);
  }

  obtenerTecnicosPaginadosExclusivo(page: number, size: number, term?: string): Observable<any> {
    let url = `${this.baseUrl}/empleados/tecnicos/paginados?page=${page}&size=${size}`;
    if (term) {
      url += `&term=${term}`;
    }
    return this.http.get<any>(url);
  }

  obtenerAsignadas(fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/despacho/asignadas?fecha=${fecha}`);
  }

  editarBloque(bloqueId: number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/despacho/turnos/bloques/${bloqueId}`, dto);
  }

  eliminarBloque(bloqueId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/despacho/turnos/bloques/${bloqueId}`);
  }

  reprogramarInstalacion(instalacionId: number, dto: {nuevaFecha: string, motivo: string}): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/instalaciones/${instalacionId}/reprogramar`, dto);
  }

  cancelarInstalacion(instalacionId: number, motivo?: string): Observable<any> {
    const body = motivo ? { observaciones: motivo } : {};
    return this.http.put<any>(`${this.baseUrl}/instalaciones/${instalacionId}/cancelar`, body);
  }

  completarInstalacion(instalacionId: number, dto?: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/instalaciones/${instalacionId}/completar`, dto || {});
  }

  buscarInstalaciones(criterio: string, valor: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/despacho/buscar?criterio=${criterio}&valor=${valor}`);
  }
}
