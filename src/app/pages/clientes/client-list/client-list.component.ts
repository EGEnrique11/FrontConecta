import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-client-list',
  imports: [CommonModule, MatFormFieldModule,MatSelectModule,
    MatInputModule, MatTableModule, MatPaginatorModule, FormsModule
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export default class ClientListComponent {
  criteriosBusqueda = [
    { value: 'codigo', viewValue: 'Código Cliente' },
    { value: 'celular', viewValue: 'Celular' },
    { value: 'documento', viewValue: 'Documento' }
  ];
  criterioSeleccionado = 'codigo';
  valorBusqueda = '';
  clientes = new MatTableDataSource<any>([]); // Fuente de datos para la tabla
  displayedColumns: string[] = ['codigo', 'documento', 'nombre', 'celular', 'direccion', 'servicio'];
  totalClientes = 0;
  constructor() {}

  buscarClientes(): void {
    console.log('Buscando clientes por:', this.criterioSeleccionado, 'con valor:', this.valorBusqueda);
    // Simulación de datos
    this.clientes.data = [
      {
        codigo: 'C001',
        documento: '12345678',
        nombre: 'Juan Pérez',
        celular: '987654321',
        direccion: 'Av. Siempre Viva 123',
        servicio: 'Internet + TV'
      },
      {
        codigo: 'C002',
        documento: '87654321',
        nombre: 'María López',
        celular: '987654322',
        direccion: 'Calle Falsa 456',
        servicio: 'Internet'
      }
    ];
    this.totalClientes = this.clientes.data.length;
  }

  cambiarPagina(event: any): void {
    console.log('Cambiando página:', event);
    // Lógica para manejar la paginación
  }
}
