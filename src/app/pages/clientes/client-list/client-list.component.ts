import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClienteHttpService } from '../../../core/infrastructure/cliente-http.service';
import { Router } from '@angular/router';
import { ClienteDto } from '../../../core/models/shared/cliente.model';
import { ClienteStateService } from '../../../features/clientes/cliente-state.service';
@Component({
  selector: 'app-client-list',
  imports: [CommonModule, MatFormFieldModule,MatSelectModule,
    MatInputModule, MatTableModule, MatPaginatorModule, FormsModule
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export default class ClientListComponent implements OnInit, OnDestroy{
  private readonly clienteHttp = inject(ClienteHttpService);
  public state = inject(ClienteStateService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.ejecutarBusqueda();
  }

  ngOnDestroy(): void {
    this.state.clearState();
  }

  buscarDesdeCero(): void{
    this.state.setPagination(this.state.totalElements(), this.state.pageSize(), 0);
    this.ejecutarBusqueda();
  }

  onPageChange(event: PageEvent): void{
    this.state.setPagination(this.state.totalElements(), event.pageSize, event.pageIndex);
    this.ejecutarBusqueda();
  }

  private ejecutarBusqueda(): void{
    this.state.setLoading(true);
    this.clienteHttp.buscarClientesPaginados(
      this.state.criterio(),
      this.state.valorBusqueda(),
      this.state.pageIndex(),
      this.state.pageSize()
    ).subscribe({
      next: (response) => {
        this.state.setClientes(response.content || []);
        const total = response.page?.totalElements ?? response.totalElements ?? 0;
        const size = response.page?.size ?? response.size ?? 10;
        const index = response.page?.number ?? response.size ?? 0;

        this.state.setPagination(total, size, index);
        this.state.setLoading(false);
      },
      error: (err) =>{
        console.error('Error al buscar clientes', err);
        this.state.setLoading(false);
      }
    });
  }

  verDetalles(id: number): void{
    this.router.navigate(['/clientes/detalle',id]);
  }
}
