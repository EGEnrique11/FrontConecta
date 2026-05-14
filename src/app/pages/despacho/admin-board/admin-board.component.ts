import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { DespachoHttpService } from '../../../core/infrastructure/despacho-http.service';
import { DespachoStateService } from '../../../features/despacho/services/despacho-state.service';
import { InstalacionPendienteDTO } from '../../../core/models/despacho/despacho.model';

@Component({
  selector: 'app-admin-board',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-board.component.html',
  styleUrl: './admin-board.component.css'
})
export default class AdminBoardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private httpService = inject(DespachoHttpService);
  public state = inject(DespachoStateService);

  fechaSelect = signal<string>(new Date().toISOString().split('T')[0]);
  franjaSelect = signal<string>('MAÑANA');

  setFechaSelect(val: string) {
    this.fechaSelect.set(val);
  }

  setFranjaSelect(val: string) {
    this.franjaSelect.set(val);
  }

  // Form for assignment
  assignForm!: FormGroup;
  selectedInstalacion = signal<InstalacionPendienteDTO | null>(null);

  // Tabs
  activeTab = signal<string>('tablero');

  // Turnos & Tecnicos
  searchTerm = signal<string>('');
  tecnicosBuscados = signal<any[]>([]);
  turnosDisponibles = signal<any[]>([]);
  selectedTecnicoForTurno = signal<any>(null);

  // Pagination for Equipo
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  totalPages = signal<number>(0);
  isGlobalSearch = signal<boolean>(false);

  // Blocks
  tecnicoBloques = signal<any[]>([]);

  // Turno Manager
  selectedTurnoForManager = signal<any>(null);
  turnoBloques = signal<any[]>([]);
  bloqueForm!: FormGroup;

  turnoForm!: FormGroup;
  reprogramarForm!: FormGroup;

  // Search Global
  criterioBusqueda = signal<string>('DOCUMENTO');
  globalSearchTerm = signal<string>('');
  searchResults = signal<any[]>([]);
  searchModalVisible = signal<boolean>(false);

  // Reprogramar Modal
  reprogramarModalVisible = signal<boolean>(false);
  instToReprogramar = signal<InstalacionPendienteDTO | null>(null);

  // Edit Bloque Modal
  editBloqueForm!: FormGroup;
  editBloqueModalVisible = signal<boolean>(false);
  bloqueToEdit = signal<any>(null);

  // Delete Bloque Modal
  deleteBloqueModalVisible = signal<boolean>(false);
  bloqueIdAEliminar = signal<number | null>(null);

  // Completar / Cancelar Instalacion Modals
  completarModalVisible = signal<boolean>(false);
  cancelarModalVisible = signal<boolean>(false);
  instalacionIdACompletar = signal<number | null>(null);
  instalacionIdACancelar = signal<number | null>(null);

  constructor() {
    this.assignForm = this.fb.group({
      tecnicoId: [null, Validators.required],
      bloqueId: [null, Validators.required]
    });

    this.turnoForm = this.fb.group({
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required]
    });

    this.bloqueForm = this.fb.group({
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      esRefrigerio: [false]
    });

    this.editBloqueForm = this.fb.group({
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      esRefrigerio: [false]
    });

    this.reprogramarForm = this.fb.group({
      nuevaFecha: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTecnicos();
    this.loadPendientes();
    this.loadTurnos();
    this.loadEquipoPaginado();
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
  }

  loadTurnos() {
    this.httpService.obtenerTurnos().subscribe({
      next: (data) => this.turnosDisponibles.set(data),
      error: (err) => console.error(err)
    });
  }

  // ==== EQUIPO TÉCNICO & PAGINATION ====

  loadEquipoPaginado() {
    const criterio = this.searchTerm().trim() ? 'GENERAL' : undefined;
    const valor = this.searchTerm().trim() || undefined;

    this.httpService.obtenerTecnicosPaginadosExclusivo(this.currentPage(), this.pageSize(), valor).subscribe({
      next: (data) => {
        // Map to TecnicoResumenDTO structure for compatibility
        const mapped = data.content.map((emp: any) => ({
          id: emp.id,
          nombreCompleto: emp.nombreCompleto || emp.nombresCompletos,
          documento: emp.documento,
          celular: emp.celular,
          turnoId: emp.turnoId,
          turnoNombre: emp.turnoNombre
        }));
        this.tecnicosBuscados.set(mapped);
        this.totalPages.set(data.totalPages);
        this.isGlobalSearch.set(false);
      },
      error: (err) => console.error(err)
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
      this.isGlobalSearch() ? this.buscarTecnicoResumen() : this.loadEquipoPaginado();
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
      this.isGlobalSearch() ? this.buscarTecnicoResumen() : this.loadEquipoPaginado();
    }
  }

  buscarTecnicoResumen() {
    if (!this.searchTerm().trim()) {
      this.currentPage.set(0);
      this.loadEquipoPaginado();
      return;
    }
    this.isGlobalSearch.set(true);
    // Using the lightweight endpoint
    this.httpService.buscarTecnicos(this.searchTerm()).subscribe({
      next: (data) => {
        this.tecnicosBuscados.set(data);
        this.totalPages.set(1); // Lightweight search doesn't paginate currently
      },
      error: (err) => console.error(err)
    });
  }

  seleccionarTecnico(tecnico: any) {
    this.selectedTecnicoForTurno.set(tecnico);
  }

  guardarTurnoTecnico(tecnicoId: number, event: any) {
    const turnoId = event.target.value;
    if (!turnoId) return;

    this.httpService.asignarTurnoATecnico(tecnicoId, turnoId).subscribe({
      next: () => {
        alert("Turno asignado correctamente.");
        this.isGlobalSearch() ? this.buscarTecnicoResumen() : this.loadEquipoPaginado();
      },
      error: (err) => alert("Error al asignar turno")
    });
  }

  // ==== GESTIÓN DE TURNOS ====

  crearTurno() {
    if (this.turnoForm.invalid) return;
    this.httpService.crearTurno(this.turnoForm.value).subscribe({
      next: () => {
        alert("Turno y bloques generados.");
        this.loadTurnos();
        this.turnoForm.reset();
      },
      error: (err) => alert("Error al crear turno")
    });
  }

  gestionarBloques(turno: any) {
    this.selectedTurnoForManager.set(turno);
    this.cargarBloquesDelTurno(turno.id);
  }

  cargarBloquesDelTurno(turnoId: number) {
    this.httpService.obtenerBloquesPorTurno(turnoId).subscribe({
      next: (data) => this.turnoBloques.set(data),
      error: (err) => console.error(err)
    });
  }

  agregarBloque() {
    if (this.bloqueForm.invalid || !this.selectedTurnoForManager()) return;

    this.httpService.crearBloque(this.selectedTurnoForManager().id, this.bloqueForm.value).subscribe({
      next: () => {
        this.cargarBloquesDelTurno(this.selectedTurnoForManager().id);
        this.bloqueForm.reset({ esRefrigerio: false });
      },
      error: (err) => alert(err.error?.message || "Error al agregar bloque")
    });
  }

  onEditarBloque(bloque: any) {
    this.bloqueToEdit.set(bloque);

    // Parseo seguro de horas (el backend podría enviar LocalTime como Array [HH, mm, ss] o String)
    const parseTime = (time: any) => {
      if (Array.isArray(time)) {
        return `${time[0].toString().padStart(2, '0')}:${time[1].toString().padStart(2, '0')}`;
      }
      return time ? time.substring(0, 5) : '';
    };

    this.editBloqueForm.patchValue({
      horaInicio: parseTime(bloque.horaInicio),
      horaFin: parseTime(bloque.horaFin),
      esRefrigerio: bloque.esRefrigerio || false
    });
    this.editBloqueModalVisible.set(true);
  }

  cerrarEditBloqueModal() {
    this.editBloqueModalVisible.set(false);
    this.bloqueToEdit.set(null);
  }

  actualizarBloqueSubmit() {
    if (this.editBloqueForm.invalid || !this.bloqueToEdit()) return;

    let { horaInicio, horaFin, esRefrigerio } = this.editBloqueForm.value;
    const dto = {
      horaInicio: horaInicio.length === 5 ? horaInicio + ":00" : horaInicio,
      horaFin: horaFin.length === 5 ? horaFin + ":00" : horaFin,
      esRefrigerio: esRefrigerio
    };

    this.httpService.editarBloque(this.bloqueToEdit().id, dto).subscribe({
      next: () => {
        alert("Bloque actualizado correctamente");
        this.cargarBloquesDelTurno(this.selectedTurnoForManager().id);
        this.cerrarEditBloqueModal();
      },
      error: () => alert("Error al editar bloque")
    });
  }

  onEliminarBloque(bloqueId: number) {
    this.bloqueIdAEliminar.set(bloqueId);
    this.deleteBloqueModalVisible.set(true);
  }

  confirmarEliminacion() {
    const id = this.bloqueIdAEliminar();
    if (!id) return;
    this.httpService.eliminarBloque(id).subscribe({
      next: () => {
        this.cargarBloquesDelTurno(this.selectedTurnoForManager().id);
        this.cancelarEliminacion();
      },
      error: () => alert("Error al eliminar bloque")
    });
  }

  cancelarEliminacion() {
    this.deleteBloqueModalVisible.set(false);
    this.bloqueIdAEliminar.set(null);
  }

  // ==== TABLERO OPERATIVO ====

  loadTecnicos() {
    this.httpService.obtenerListaTecnicos().subscribe({
      next: (data) => this.state.setTecnicos(data),
      error: (err) => console.error(err)
    });
  }

  asignadas = signal<InstalacionPendienteDTO[]>([]);

  loadPendientes() {
    this.httpService.obtenerPendientes(this.fechaSelect(), this.franjaSelect()).subscribe({
      next: (data) => {
        this.state.setPendientes(data);
      },
      error: (err) => console.error(err)
    });
    this.loadAsignadas();
  }

  loadAsignadas() {
    this.httpService.obtenerAsignadas(this.fechaSelect()).subscribe({
      next: (data) => this.asignadas.set(data),
      error: (err) => console.error(err)
    });
  }

  onFilterChange() {
    this.loadPendientes();
  }

  selectInstalacion(inst: InstalacionPendienteDTO) {
    if (inst.estado === 'PENDIENTE' || inst.estado === 'REPROGRAMADA') {
      this.selectedInstalacion.set(inst);
      this.assignForm.patchValue({ bloqueId: null, tecnicoId: null });
      this.tecnicoBloques.set([]);
    }
  }

  onTecnicoSelected(event: any) {
    const tecnicoId = event.target.value;
    if (!tecnicoId || tecnicoId === "null") {
      this.tecnicoBloques.set([]);
      return;
    }

    this.httpService.obtenerTurnoDeTecnico(tecnicoId).subscribe({
      next: (turno) => {
        if (turno && turno.id) {
          this.httpService.obtenerBloquesPorTurno(turno.id).subscribe({
            next: (bloques) => this.tecnicoBloques.set(bloques),
            error: () => this.tecnicoBloques.set([])
          });
        } else {
          this.tecnicoBloques.set([]);
        }
      },
      error: () => this.tecnicoBloques.set([])
    });
  }

  asignarRuta() {
    const instalacion = this.selectedInstalacion();
    if (this.assignForm.invalid || !instalacion) return;

    const dto = {
      tecnicoId: Number(this.assignForm.value.tecnicoId),
      bloqueId: Number(this.assignForm.value.bloqueId)
    };

    this.httpService.asignarTecnico(instalacion.id, dto).subscribe({
      next: () => {
        alert("Ruta asignada");
        this.selectedInstalacion.set(null);
        this.loadPendientes();
      },
      error: (err) => alert(err.error?.message || "Error al asignar")
    });
  }

  // ==== MÉTODOS DE CICLO DE VIDA ====

  onCancelarInstalacion(id: number) {
    this.instalacionIdACancelar.set(id);
    this.cancelarModalVisible.set(true);
  }

  confirmarCancelar() {
    const id = this.instalacionIdACancelar();
    if (!id) return;
    
    this.httpService.cancelarInstalacion(id).subscribe({
      next: () => {
        this.loadPendientes();
        if (this.searchModalVisible()) this.buscarInstalacionesGlobal();
        this.cerrarModalCancelar();
      },
      error: (err) => alert("Error al cancelar: " + (err.error?.message || "Error interno"))
    });
  }

  cerrarModalCancelar() {
    this.cancelarModalVisible.set(false);
    this.instalacionIdACancelar.set(null);
  }

  onCompletarInstalacion(id: number) {
    this.instalacionIdACompletar.set(id);
    this.completarModalVisible.set(true);
  }

  confirmarCompletar() {
    const id = this.instalacionIdACompletar();
    if (!id) return;
    
    this.httpService.completarInstalacion(id).subscribe({
      next: () => {
        this.loadPendientes();
        if (this.searchModalVisible()) this.buscarInstalacionesGlobal();
        this.cerrarModalCompletar();
      },
      error: (err) => alert("Error al completar: " + (err.error?.message || "Error interno"))
    });
  }

  cerrarModalCompletar() {
    this.completarModalVisible.set(false);
    this.instalacionIdACompletar.set(null);
  }

  // ==== BUSCADOR GLOBAL ====
  buscarInstalacionesGlobal() {
    if (!this.globalSearchTerm().trim()) {
      this.searchResults.set([]);
      return;
    }
    this.httpService.buscarInstalaciones(this.criterioBusqueda(), this.globalSearchTerm()).subscribe({
      next: (data) => {
        this.searchResults.set(data);
        this.searchModalVisible.set(true);
      },
      error: () => alert("Error en búsqueda")
    });
  }

  cerrarSearchModal() {
    this.searchModalVisible.set(false);
  }

  // ==== MODAL REPROGRAMAR ====
  abrirReprogramarModal(inst: InstalacionPendienteDTO) {
    this.instToReprogramar.set(inst);
    this.reprogramarForm.patchValue({ nuevaFecha: '', motivo: '' });
    this.reprogramarModalVisible.set(true);
    if (this.searchModalVisible()) this.searchModalVisible.set(false);
  }

  cerrarReprogramarModal() {
    this.reprogramarModalVisible.set(false);
    this.instToReprogramar.set(null);
  }

  reprogramarInstalacionSubmit() {
    const instalacion = this.instToReprogramar();
    if (this.reprogramarForm.invalid || !instalacion) return;

    const dto = {
      nuevaFecha: this.reprogramarForm.value.nuevaFecha,
      motivo: this.reprogramarForm.value.motivo
    };

    this.httpService.reprogramarInstalacion(instalacion.id, dto).subscribe({
      next: () => {
        alert("Instalación reprogramada exitosamente.");
        this.cerrarReprogramarModal();
        this.loadPendientes();
      },
      error: (err) => alert("Error al reprogramar: " + (err.error?.message || "Servidor no responde"))
    });
  }
}
