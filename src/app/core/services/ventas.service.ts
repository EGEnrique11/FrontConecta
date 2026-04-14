import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Ubicacion } from '../models/ubicaciones.model';
import { ClienteDto } from '../models/venta/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  getDepartamentos(): Observable<Ubicacion[]>{
    return this.http.get<Ubicacion[]>(`${this.baseUrl}/ubicaciones/departamentos/`);
  }
  getProvincias(idDepartamento: number): Observable<Ubicacion[]>{
    return this.http.get<Ubicacion[]>(`${this.baseUrl}/ubicaciones/provincias/departamento/${idDepartamento}`);
  }
  getDistritos(idProvincia: number): Observable<Ubicacion[]>{
    return this.http.get<Ubicacion[]>(`${this.baseUrl}/ubicaciones/distritos/provincia/${idProvincia}`);
  }
  registrarCliente(dto: ClienteDto): Observable<any>{
    return this.http.post(`${this.baseUrl}/clientes/`, dto);
  }
}
