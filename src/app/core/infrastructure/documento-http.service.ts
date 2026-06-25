import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EmailRequestDTO } from '../models/facturacion/documento.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentoHttpService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  enviarContratoPorCorreo(contratoId: number, request: EmailRequestDTO): Observable<any>{
    return this.http.post(`${this.baseUrl}/documentos/contrato/${contratoId}/enviar-correo`, request);
  }
  
  enviarReciboPorCorreo(reciboId: number, request: EmailRequestDTO): Observable<any>{
    return this.http.post(`${this.baseUrl}/documentos/recibo/${reciboId}/enviar-correo`, request);
  }

  downloadContratoPdf(contratoId: number): Observable<Blob>{
    return this.http.get(`${this.baseUrl}/documentos/contrato/${contratoId}/pdf`, {responseType: 'blob'});
  }
  downloadReciboPdf(reciboId: number): Observable<Blob>{
    return this.http.get(`${this.baseUrl}/documentos/recibo/${reciboId}/pdf`, {responseType: 'blob'});
  }
}
