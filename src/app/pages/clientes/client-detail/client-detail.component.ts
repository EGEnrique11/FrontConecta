import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { TabDatosComponent } from './components/tab-datos/tab-datos.component';
import { TabOfertasComponent } from './components/tab-ofertas/tab-ofertas.component';
import { TabFacturacionComponent } from './components/tab-facturacion/tab-facturacion.component';
import { TabServiciosComponent } from './components/tab-servicios/tab-servicios.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteHttpService } from '../../../core/infrastructure/cliente-http.service';
import { ClienteDto } from '../../../core/models/shared/cliente.model';

@Component({
  selector: 'app-client-detail',
  imports: [
    CommonModule,
    TabDatosComponent,
    TabOfertasComponent,
    TabFacturacionComponent,
    TabServiciosComponent
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css'
})
export default class ClientDetailComponent implements OnInit{
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clienteHttp = inject(ClienteHttpService);

  cliente = signal<ClienteDto | null>(null);
  isLoading = signal<boolean>(true);
  activeTab = signal<string>('DATOS');

  ngOnInit(): void {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam){
        this.cargarDetalleCliente(Number(idParam));
      } else {
        this.regresarAlListado();
      }
  }

  cargarDetalleCliente(id: number): void {
    this.isLoading.set(true);
    this.clienteHttp.obtenerClientePorId(id).subscribe({
      next: (data) => {
        this.cliente.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener el detalle del cliente:', err);
        this.isLoading.set(false);
        this.regresarAlListado();
      }
    });
  }
  
  setTab(tabName: string): void{
    this.activeTab.set(tabName);
  }
  regresarAlListado(): void{
    this.router.navigate(['/clientes']);
  }
}
