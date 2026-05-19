import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteHttpService } from '../../../../../core/infrastructure/cliente-http.service';

@Component({
  selector: 'app-tab-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-servicios.component.html',
  styleUrl: './tab-servicios.component.css'
})
export class TabServiciosComponent implements OnInit {
  clienteId = input.required<number>();
  
  contratos = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  private clienteService = inject(ClienteHttpService);

  ngOnInit(): void {
    this.clienteService.obtenerContratosPorCliente(this.clienteId()).subscribe({
      next: (data) => {
        this.contratos.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener contratos', err);
        this.isLoading.set(false);
      }
    });
  }
}
