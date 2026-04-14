import { Component } from '@angular/core';
import { MatFormField } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-control',
  imports: [MatFormField, MatSelectModule, MatPaginatorModule, CommonModule],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css'
})
export default class ControlComponent {
  estados = [
    { value: 'activo', viewValue: 'ACTIVO' },
    { value: 'baja', viewValue: 'BAJA' },
    { value: 'noventa', viewValue: 'NOVENTA' },
    { value: 'suspendido', viewValue: 'SUSPENDIDO' },
    { value: 'mora', viewValue: 'MORA' }
  ];
  estadoSeleccionado = 'activo';
  clientes: any[] = [];
  totalClientes = 0;
  constructor(){}
  buscarClientes(): void {
    // Lógica para buscar clientes según el estado seleccionado
    console.log('Buscando clientes con estado:', this.estadoSeleccionado);
    // Simulación de datos
    this.clientes = [
      {
        codigo: 'C001',
        estado: 'ACTIVO',
        nombre: 'Juan Pérez',
        correo: 'juan.perez@example.com',
        celular: '987654321',
        direccion: 'Av. Siempre Viva 123',
        servicio: 'Internet + TV'
      },
      {
        codigo: 'C002',
        estado: 'MORA',
        nombre: 'María López',
        correo: 'maria.lopez@example.com',
        celular: '987654322',
        direccion: 'Calle Falsa 456',
        servicio: 'Internet'
      }
    ];
    this.totalClientes = this.clientes.length;
  }

  actualizarCliente(cliente: any): void {
    console.log('Actualizar cliente:', cliente);
    // Lógica para actualizar cliente
  }

  eliminarCliente(cliente: any): void {
    console.log('Eliminar cliente:', cliente);
    // Lógica para eliminar cliente
  }

  enviarNotificacion(cliente: any): void {
    console.log('Enviar notificación a cliente:', cliente);
    // Lógica para enviar notificación
  }

  enviarNotificaciones(): void {
    console.log('Enviar notificaciones a todos los clientes');
    // Lógica para enviar notificaciones masivas
  }

  cambiarPagina(event: any): void {
    console.log('Cambiando página:', event);
    // Lógica para manejar la paginación
  }

}
