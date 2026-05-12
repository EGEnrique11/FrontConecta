import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { EmpleadoHttpService } from '../../../core/infrastructure/empleado-http.service';

@Component({
  selector: 'app-empleado-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './empleado-list.component.html',
  styleUrl: './empleado-list.component.css'
})
export default class EmpleadoListComponent implements OnInit {
  private httpService = inject(EmpleadoHttpService);
  private fb = inject(FormBuilder);

  // Pagination State
  empleados = signal<any[]>([]);
  totalElements = signal<number>(0);
  totalPages = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(15);

  // Filters State
  roles = signal<any[]>([]);
  rolFilter = signal<string>('');
  tipoDocFilter = signal<string>('');
  // Strict Search State
  criterioFilter = signal<string>('NOMBRE');
  valorFilter = signal<string>('');

  // Modal State
  isModalOpen = signal<boolean>(false);
  registroForm!: FormGroup;

  // Translador
  private roleNamesMap: Record<string, string> = {
  'ROLE_DEVELOPER': 'Desarrollador',
  'ROLE_ADMIN': 'Administrador',
  'ROLE_VENDEDOR': 'Vendedor',
  'ROLE_TECNICO': 'Técnico'
  };
  constructor() {
    this.registroForm = this.fb.group({
      tipoDocumento: ['DNI', Validators.required],
      documento: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: [''],
      correo: ['', [Validators.required, Validators.email]],
      celular: [''], // dynamically validated below
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roles: [[], Validators.required]
    });

    // Validacion dinámica: Si el rol seleccionado incluye TECNICO, celular es required
    this.registroForm.get('roles')?.valueChanges.subscribe(roles => {
      const celControl = this.registroForm.get('celular');
      if (roles && roles.includes('ROLE_TECNICO')) {
        celControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{9}$')]);
      } else {
        celControl?.clearValidators();
      }
      celControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadEmpleados(0);
  }

  loadRoles() {
    this.httpService.obtenerRoles().subscribe({
      next: (data) => {
        const rolesWithDisplayName = data.map(rol => {
          return {
            ...rol,
            displayName: this.roleNamesMap[rol.roleName] || rol.roleName.replace('ROLE_', '')
          };
        });
        this.roles.set(rolesWithDisplayName);
      },
      error: (err) => console.error(err)
    });
  }

  loadEmpleados(page: number) {
    let tipoDoc = this.tipoDocFilter() || undefined;
    if (this.criterioFilter() !== 'DOCUMENTO') {
      tipoDoc = undefined;
    }

    this.httpService.obtenerEmpleadosPaginados(
      page,
      this.pageSize(),
      this.rolFilter() || undefined,
      tipoDoc,
      this.criterioFilter(),
      this.valorFilter() || undefined
    ).subscribe({
      next: (data) => {
        this.empleados.set(data.content);
        this.totalElements.set(data.totalElements);
        this.totalPages.set(data.totalPages);
        this.currentPage.set(data.number);
      },
      error: (err) => console.error(err)
    });
  }

  setRolFilter(val: string) {
    this.rolFilter.set(val);
    this.loadEmpleados(0);
  }

  setTipoDocFilter(val: string) {
    this.tipoDocFilter.set(val);
    this.loadEmpleados(0);
  }

  setCriterioFilter(val: string) {
    this.criterioFilter.set(val);
    this.valorFilter.set('');
  }

  setValorFilter(val: string) {
    this.valorFilter.set(val);
  }

  search() {
    this.loadEmpleados(0);
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.loadEmpleados(newPage);
    }
  }

  openModal() {
    this.registroForm.reset({ tipoDocumento: 'DNI', roles: [] });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  guardarEmpleado() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.httpService.registrarEmpleado(this.registroForm.value).subscribe({
      next: () => {
        alert("Empleado registrado exitosamente");
        this.closeModal();
        this.loadEmpleados(0);
      },
      error: (err) => alert(err.error?.message || "Error al registrar empleado")
    });
  }

  // Helper
  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }
}
