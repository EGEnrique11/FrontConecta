import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ubicacion } from '../models/ubicaciones.model';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1/ubicaciones';

  getDepartamentos(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.baseUrl}/departamentos`);
  }

  getProvincias(idDepartamento: number): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.baseUrl}/provincias/${idDepartamento}`);
  }

  getDistritos(idProvincia: number): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.baseUrl}/distritos/${idProvincia}`);
  }
}
