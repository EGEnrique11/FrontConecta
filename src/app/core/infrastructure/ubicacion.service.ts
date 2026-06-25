import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ubicacion } from '../models/ubicaciones.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getDepartamentos(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.baseUrl}/ubicaciones/departamentos`);
  }

  getProvincias(idDepartamento: number): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.baseUrl}/ubicaciones/provincias/${idDepartamento}`);
  }

  getDistritos(idProvincia: number): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.baseUrl}/ubicaciones/distritos/${idProvincia}`);
  }
}
