import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EmailRequestDTO } from '../models/facturacion/documento.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentoHttpService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1/documentos';

  enviarContratoPorCorreo(contratoId: number, request: EmailRequestDTO): Observable<any>{
    return this.http.post(`${this.baseUrl}/contrato/${contratoId}/enviar-correo`, request);
  }
  
  enviarReciboPorCorreo(reciboId: number, request: EmailRequestDTO): Observable<any>{
    return this.http.post(`${this.baseUrl}/recibo/${reciboId}/enviar-correo`, request);
  }

  downloadContratoPdf(contratoId: number): Observable<Blob>{
    return this.http.get(`${this.baseUrl}/contrato/${contratoId}/pdf`, {responseType: 'blob'});
  }
  downloadReciboPdf(reciboId: number): Observable<Blob>{
    return this.http.get(`${this.baseUrl}/recibo/${reciboId}/pdf`, {responseType: 'blob'});
  }
}
