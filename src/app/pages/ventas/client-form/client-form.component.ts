import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, filter, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs';

import { TipoDocumento, TipoUrbanizacion, TipoVia, TipoVivienda } from '../../../core/models/venta/tipo-enums.model';
import { Ubicacion } from '../../../core/models/ubicaciones.model';
import { UbicacionService } from '../../../core/infrastructure/ubicacion.service';
import { VentasHttpService } from '../../../core/infrastructure/ventas-http.service';
import { VentaStateService } from '../../../features/ventas/services/venta-state.service';
import { ClienteDto } from '../../../core/models/venta/cliente.model';
import { GoogleMap, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMap, MapMarker],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export default class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ubicacionService = inject(UbicacionService);
  private ventasHttpService = inject(VentasHttpService);
  private ventaStateService = inject(VentaStateService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  form!: FormGroup;
  maxDate!: string;

  tiposDocumento = Object.values(TipoDocumento);
  tiposVia = Object.values(TipoVia);
  tiposUrbanizacion = Object.values(TipoUrbanizacion);
  tiposVivienda = Object.values(TipoVivienda);

  departamentos = signal<Ubicacion[]>([]);
  provincias = signal<Ubicacion[]>([]);
  distritos = signal<Ubicacion[]>([]);

  // Google Maps State
  mapCenter: google.maps.LatLngLiteral = { lat: -12.07434474067848, lng: -76.95631814787696 };
  mapZoom = 15;
  markerPosition = signal<google.maps.LatLngLiteral | null>({ lat: -12.07434474067848, lng: -76.95631814787696 });

  updateCoordinates(lat: number, lng: number): void {
    this.markerPosition.set({ lat, lng });
    this.form.get('direccion')?.patchValue({
      latitud: lat.toString(),
      longitud: lng.toString()
    });
  }

  onInputChange(): void {
    const latRaw = this.form.get('direccion.latitud')?.value;
    const lngRaw = this.form.get('direccion.longitud')?.value;
    const lat = parseFloat(latRaw);
    const lng = parseFloat(lngRaw);

    if (!isNaN(lat) && !isNaN(lng)) {
      this.markerPosition.set({ lat, lng });
      this.mapCenter = { lat, lng };
    }
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.updateCoordinates(event.latLng.lat(), event.latLng.lng());
    }
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.updateCoordinates(event.latLng.lat(), event.latLng.lng());
    }
  }

  constructor() {
    this.buildForm();
    this.initMaxDate();
    
    // Reactividad de departamentos -> provincias
    this.form.get('direccion.departamento')?.valueChanges
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.provincias.set([]);
          this.distritos.set([]);
          this.form.get('direccion')?.patchValue({ provincia: null, distrito: null }, { emitEvent: false });
        }),
        filter((id): id is number => !!id),
        switchMap(id => this.ubicacionService.getProvincias(id).pipe(catchError(() => of([]))))
      )
      .subscribe(res => this.provincias.set(res));

    // Reactividad de provincias -> distritos
    this.form.get('direccion.provincia')?.valueChanges
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.distritos.set([]);
          this.form.get('direccion')?.patchValue({ distrito: null }, { emitEvent: false });
        }),
        filter((id): id is number => !!id),
        switchMap(id => this.ubicacionService.getDistritos(id).pipe(catchError(() => of([]))))
      )
      .subscribe(res => this.distritos.set(res));
  }

  ngOnInit(): void {
    this.ubicacionService.getDepartamentos().subscribe({
      next: data => this.departamentos.set(data),
      error: err => console.error("Error loading departments", err)
    });

    this.setupConditionalValidators();
    this.setupDniSearch();
  }

  private setupDniSearch(): void {
    this.form.get('documento')?.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500),
        distinctUntilChanged(),
        filter(dni => dni && dni.length >= 8),
        switchMap(dni => this.ventasHttpService.buscarClientePorDni(dni).pipe(
          catchError(() => {
            this.clearClientIdentity();
            return of(null);
          })
        ))
      )
      .subscribe(cliente => {
        if (cliente) {
          this.form.patchValue({
            clienteId: cliente.id,
            nombres: cliente.nombres,
            apellidoPaterno: cliente.apellidoPaterno,
            apellidoMaterno: cliente.apellidoMaterno,
            correo: cliente.correo,
            celular: cliente.celular
          }, { emitEvent: false });
          
          this.form.get('nombres')?.disable();
          this.form.get('apellidoPaterno')?.disable();
          this.form.get('apellidoMaterno')?.disable();
          this.form.get('correo')?.disable();
          this.form.get('celular')?.disable();
        } else {
          this.clearClientIdentity();
        }
      });
  }

  private clearClientIdentity(): void {
    this.form.get('clienteId')?.setValue(null);
    this.form.get('nombres')?.enable();
    this.form.get('apellidoPaterno')?.enable();
    this.form.get('apellidoMaterno')?.enable();
    this.form.get('correo')?.enable();
    this.form.get('celular')?.enable();
  }

  private setupConditionalValidators(): void {
    const dir = this.form.get('direccion') as FormGroup;
    if (!dir) return;

    dir.get('tipoVia')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(val => {
      const nombreViaCtrl = dir.get('nombreVia');
      const numeroCtrl = dir.get('numero');
      
      if (val) {
        nombreViaCtrl?.setValidators([Validators.required]);
        numeroCtrl?.setValidators([Validators.required, Validators.pattern(/^(\d+|[sS]\/?[nN])$/)]);
      } else {
        nombreViaCtrl?.clearValidators();
        numeroCtrl?.clearValidators();
      }
      nombreViaCtrl?.updateValueAndValidity({ emitEvent: false });
      numeroCtrl?.updateValueAndValidity({ emitEvent: false });
    });

    dir.get('tipoUrbanizacion')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(val => {
      const nombreUrbCtrl = dir.get('nombreUrbanizacion');
      const mzCtrl = dir.get('manzana');
      const ltCtrl = dir.get('lote');

      if (val) {
        nombreUrbCtrl?.setValidators([Validators.required]);
        mzCtrl?.setValidators([Validators.required]);
        ltCtrl?.setValidators([Validators.required]);
      } else {
        nombreUrbCtrl?.clearValidators();
        mzCtrl?.clearValidators();
        ltCtrl?.clearValidators();
      }
      nombreUrbCtrl?.updateValueAndValidity({ emitEvent: false });
      mzCtrl?.updateValueAndValidity({ emitEvent: false });
      ltCtrl?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private initMaxDate(): void {
    const max = new Date();
    max.setFullYear(max.getFullYear() - 18);
    this.maxDate = max.toISOString().split('T')[0];
  }

  private buildForm(): void {
    this.form = this.fb.group({
      clienteId: [null],
      direccionId: [null],
      tipoDocumento: [null, Validators.required],
      documento: ['', [Validators.required, Validators.minLength(8)]],
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.minLength(9)]],
      fechaNacimiento: [null, Validators.required],
      
      direccion: this.fb.group({
        departamento: [null, Validators.required],
        provincia: [null, Validators.required],
        distrito: [null, Validators.required],
        tipoVia: [null],
        nombreVia: [''],
        numero: [''],
        tipoUrbanizacion: [null],
        nombreUrbanizacion: [''],
        manzana: [''],
        lote: [''],
        referencia: [''],
        latitud: [null],
        longitud: [null]
      }, { validators: this.direccionValidatorGroup })
    });
  }

  private direccionValidatorGroup(group: AbstractControl): ValidationErrors | null {
    const via = group.get('tipoVia')?.value;
    const urbanizacion = group.get('tipoUrbanizacion')?.value;
    if (!via && !urbanizacion) {
      return { missingAddressType: true };
    }
    return null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // getRawValue gets disabled fields as well
    const value = this.form.getRawValue();
    const dir = value.direccion;
    
    // Preparar el esquema temporal para el Wizard
    const dto: any = {
      clienteId: value.clienteId,
      direccionId: value.direccionId,
      tipoDocumento: value.tipoDocumento,
      documento: value.documento,
      nombres: value.nombres,
      apellidoPaterno: value.apellidoPaterno,
      apellidoMaterno: value.apellidoMaterno,
      correo: value.correo,
      celular: value.celular,
      fechaNacimiento: value.fechaNacimiento,
      direccion: {
        distritoId: Number(dir.distrito),
        tipoVia: dir.tipoVia,
        numero: dir.numero,
        nombreVia: dir.nombreVia,
        tipoUrbanizacion: dir.tipoUrbanizacion,
        nombreUrbanizacion: dir.nombreUrbanizacion,
        manzana: dir.manzana,
        lote: dir.lote,
        piso: dir.piso || null, 
        interior: dir.interior || null,
        direccionCompleta: dir.referencia || '',
        latitud: dir.latitud,
        longitud: dir.longitud
      }
    };

    this.ventaStateService.setClienteData(dto);
    this.router.navigate(['/venta/servicio']);
  }
}
