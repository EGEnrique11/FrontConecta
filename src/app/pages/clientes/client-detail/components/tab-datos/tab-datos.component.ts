import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteDto } from '../../../../../core/models/shared/cliente.model';
import { ClienteHttpService } from '../../../../../core/infrastructure/cliente-http.service';

@Component({
  selector: 'app-tab-datos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tab-datos.component.html',
  styleUrl: './tab-datos.component.css'
})
export class TabDatosComponent implements OnInit {
  clienteData = input.required<ClienteDto>();
  
  isEditing = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  
  editCelular = signal<string>('');
  editCorreo = signal<string>('');

  private clienteService = inject(ClienteHttpService);

  ngOnInit() {
    this.resetForm();
  }

  toggleEdit() {
    if (this.isEditing()) {
      this.resetForm();
    }
    this.isEditing.set(!this.isEditing());
  }

  cancelEdit() {
    this.resetForm();
    this.isEditing.set(false);
  }

  private resetForm() {
    this.editCelular.set(this.clienteData().celular || '');
    this.editCorreo.set(this.clienteData().correo || '');
  }

  guardarCambios() {
    this.isSaving.set(true);
    
    const payload = {
      correo: this.editCorreo(),
      celular: this.editCelular()
    };

    this.clienteService.actualizarContacto(this.clienteData().id, payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.isEditing.set(false);
        this.clienteData().celular = payload.celular;
        this.clienteData().correo = payload.correo;
      },
      error: (err) => {
        console.error('Error al actualizar contacto', err);
        this.isSaving.set(false);
      }
    });
  }
}
