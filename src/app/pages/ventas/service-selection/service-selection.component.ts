import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { VentaStateService } from '../../../features/ventas/services/venta-state.service';
import { VentasHttpService } from '../../../core/infrastructure/ventas-http.service';
import { TipoEfectoPromocion } from '../../../core/models/venta/tipo-enums.model';

@Component({
  selector: 'app-service-selection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './service-selection.component.html',
  styleUrl: './service-selection.component.css'
})
export default class ServiceSelectionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ventaStateService = inject(VentaStateService);
  private ventasHttpService = inject(VentasHttpService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  form!: FormGroup;
  planes = signal<any[]>([]);
  promocionesDisponibles = signal<any[]>([]);
  efectosActivos = signal<any[]>([]);
  
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  minDate!: string;

  // Signal computado para agrupar
  planesPorServicio = computed(() => {
    const arr = this.planes();
    if (!arr) return {};

    return arr.reduce((acc, plan) => {
      const categoria = plan.servicio?.nombre || plan.nombreServicio || 'Generales';
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(plan);
      return acc;
    }, {} as Record<string, any[]>);
  });

  // Signal computado: resumenFinal
  resumenFinal = computed(() => {
    const planId = this.form?.get('planId')?.value;
    const efectos = this.efectosActivos();
    const arrPlanes = this.planes();
    
    if (!planId || !arrPlanes.length) return null;

    const planSeleccionado = arrPlanes.find(p => p.id === planId);
    if (!planSeleccionado) return null;

    let precioCalculado = parseFloat(planSeleccionado.precio);
    let velocidadCalculada = planSeleccionado.velocidadBaseMbps ? parseFloat(planSeleccionado.velocidadBaseMbps) : null;
    let maxDuracionMeses = 0;

    efectos.forEach(efecto => {
      const valor = parseFloat(efecto.valor);
      const tipo = efecto.tipo as TipoEfectoPromocion;
      
      if (tipo === 'DESCUENTO_PRECIO') {
        precioCalculado -= valor;
      } else if (tipo === 'MULTIPLICAR_VELOCIDAD' && velocidadCalculada) {
        velocidadCalculada = velocidadCalculada * valor;
      } else if (tipo === 'FIJAR_VELOCIDAD') {
        velocidadCalculada = valor;
      }

      if (efecto.duracionMeses && efecto.duracionMeses > maxDuracionMeses) {
        maxDuracionMeses = efecto.duracionMeses;
      }
    });

    return {
      plan: planSeleccionado,
      precioOriginal: parseFloat(planSeleccionado.precio),
      precioFinal: precioCalculado > 0 ? precioCalculado : 0,
      velocidadOriginal: planSeleccionado.velocidadBaseMbps,
      velocidadFinal: velocidadCalculada,
      cambioPrecio: precioCalculado < parseFloat(planSeleccionado.precio),
      cambioVelocidad: velocidadCalculada !== null && planSeleccionado.velocidadBaseMbps && velocidadCalculada !== parseFloat(planSeleccionado.velocidadBaseMbps),
      duracionMeses: maxDuracionMeses
    };
  });

  objectKeys = Object.keys;

  constructor() {
    this.buildForm();
    this.initMinDate();

    // Reactividad para buscar promociones cuando cambia el plan
    this.form.get('planId')?.valueChanges
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.promocionesDisponibles.set([]);
          this.efectosActivos.set([]);
          this.form.get('promocionId')?.setValue(null, { emitEvent: false });
        }),
        filter((id): id is boolean | number | string => !!id), // Allows any truthy primitive, preventing strict errors
        switchMap(id => this.ventasHttpService.getPromocionesPorPlan(id as number).pipe(catchError(() => of([]))))
      )
      .subscribe(res => this.promocionesDisponibles.set(res));

    // Reactividad para buscar efectos cuando cambia la promocion
    this.form.get('promocionId')?.valueChanges
      .pipe(
        takeUntilDestroyed(),
        tap(() => this.efectosActivos.set([])),
        filter((id): id is boolean | number | string => !!id),
        switchMap(id => this.ventasHttpService.getEfectosPorPromocion(id as number).pipe(catchError(() => of([]))))
      )
      .subscribe(res => this.efectosActivos.set(res));
  }

  ngOnInit(): void {
    const cliente = this.ventaStateService.clienteData();
    if (!cliente) {
      this.router.navigate(['/venta/registro']);
      return;
    }
    this.cargarPlanes();
  }

  private initMinDate(): void {
    const min = new Date();
    if (min.getHours() >= 12){
      min.setDate(min.getDate()+1);
    }
    const year = min.getFullYear();
    const month = ('0' + (min.getMonth() + 1)).slice(-2);
    const day = ('0' + min.getDate()).slice(-2);
    this.minDate = `${year}-${month}-${day}`;
  }

  private buildForm(): void {
    this.form = this.fb.group({
      planId: [null, Validators.required],
      promocionId: [null],
      necesitaRouter: [true],
      fechaInstalacion: [null, Validators.required],
      franjaHoraria: [null, Validators.required]
    });
  }

  private cargarPlanes(): void {
    this.hasError.set(false);
    this.ventasHttpService.getPlanesActivos().subscribe({
      next: (data) => this.planes.set(data),
      error: (err) => {
        console.error('Error fetching planes', err);
        this.hasError.set(true);
      }
    });
  }

  reintentarCarga(): void {
    this.cargarPlanes();
  }

  finalizarVenta(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValues = this.form.value;
    const currentCliente = this.ventaStateService.clienteData(); // State from Step 1

    if (!currentCliente) {
      alert("No se encontró la data del cliente. Por favor, vuelva al Paso 1.");
      return;
    }

    const payloadFinal = {
      clienteId: currentCliente.clienteId || null,
      direccionId: currentCliente.direccionId || null,
      datosCliente: currentCliente.clienteId ? null : {
        tipoDocumento: currentCliente.tipoDocumento,
        documento: currentCliente.documento,
        nombres: currentCliente.nombres,
        apellidoPaterno: currentCliente.apellidoPaterno,
        apellidoMaterno: currentCliente.apellidoMaterno,
        correo: currentCliente.correo,
        celular: currentCliente.celular,
        fechaNacimiento: currentCliente.fechaNacimiento
      },
      datosDireccion: currentCliente.direccionId ? null : currentCliente.direccion,
      planId: parseInt(formValues.planId, 10),
      promocionId: formValues.promocionId ? parseInt(formValues.promocionId, 10) : null,
      fechaProgramada: formValues.fechaInstalacion,
      franjaHoraria: formValues.franjaHoraria,
      necesitaRouter: formValues.necesitaRouter
    };

    this.ventasHttpService.registrarVentaCompleta(payloadFinal).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.ventaStateService.clearState();
        alert('Venta Completada. Se ha registrado el cliente y el contrato exitosamente.');
        this.router.navigate(['/control']);
      },
      error: (err) => {
        this.isLoading.set(false);
        alert(err.error?.message || 'Error al completar la venta');
      }
    });
  }
}
