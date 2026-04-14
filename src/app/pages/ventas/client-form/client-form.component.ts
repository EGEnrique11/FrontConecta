import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TipoDocumento, TipoUrbanizacion, TipoVia, TipoVivienda } from '../../../core/models/venta/tipo-enums.model';
import { Ubicacion } from '../../../core/models/ubicaciones.model';
import { VentasService } from '../../../core/services/ventas.service';
import { ClienteDto } from '../../../core/models/venta/cliente.model';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { catchError, filter, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-client-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, FormsModule
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export default class ClientFormComponent {
  form!: FormGroup;
  maxDate!: Date;
  tiposDocumento = Object.values(TipoDocumento);
  tiposVia = Object.values(TipoVia);
  tiposUrbanizacion = Object.values(TipoUrbanizacion);
  tiposVivienda = Object.values(TipoVivienda);
  departamentos: Ubicacion[] = [];
  provincias: Ubicacion[] = [];
  distritos: Ubicacion[] = [];

  constructor(private fb: FormBuilder, private ventaService: VentasService,
    private router: Router){}

  ngOnInit(): void {
    this.buildForm();
    this.initMaxDate();
    this.ventaService.getDepartamentos().subscribe(list => this.departamentos = list);
    this.form.get('departamento')!.valueChanges.pipe(
      filter((id): id is number => id != null),
      switchMap(id => {
        this.provincias = [];
        this.distritos = [];
        this.form.patchValue({ provincia: null, distrito: null},{ emitEvent: false });
        return this.ventaService.getProvincias(id);
      })).subscribe(p => this.provincias = p);
      this.form.get('provincia')!.valueChanges.pipe(
        filter((id): id is number => id != null),
        switchMap(id => {
          this.distritos = [];
          this.form.patchValue({ distrito: null }, { emitEvent: false });
          return this.ventaService.getDistritos(id);
        })).subscribe(d => this.distritos = d);
  }
  

  initMaxDate(): void{
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

  private buildForm(): void{
    this.form = this.fb.group({
      tipoDocumento: [null, Validators.required],
      documento: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      celular: ['', Validators.required],
      fechaNacimiento: [null, Validators.required],
      tipoVia: [null],
      numero: [''],
      nombreVia: [''],
      tipoUrbanizacion: [null],
      nombreUrbanizacion: [''],
      manzana: [''],
      lote: [''],
      piso: [''],
      interior: [''],
      tipoVivienda: [null, Validators.required],
      departamento: [null, Validators.required],
      provincia: [null, Validators.required],
      distrito: [null, Validators.required],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required]
    }, {validators: this.viaOrUrbanValidator});
  }
  private viaOrUrbanValidator(control: AbstractControl): ValidationErrors | null{
    const via = control.get('tipoVia')?.value;
    const urban = control.get('tipoUrbanizacion')?.value;
    return via || urban ? null: {needViaOrUrban: true};
  }

  onDateChange(event: MatDatepickerInputEvent<Date>){
    this.form.get('fechaNacimiento')?.setValue(event.value);
  }

  submit(): void{
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    const direccionCompleta = this.buildDireccionCompleta(v);
    const dto: ClienteDto = {
      tipoDocumento: v.tipoDocumento,
      documento: v.documento,
      nombres: v.nombres,
      apellidoPaterno: v.apellidoPaterno,
      apellidoMaterno: v.apellidoMaterno,
      correo: v.correo,
      celular: v.celular,
      fechaNacimiento: v.fechaNacimiento.toISOString().split('T')[0],
      direccion: {
        idDistrito: v.distrito,
        tipoVia: v.tipoVia ?? null,
        numero: v.tipoVia ? v.numero : null,
        nombreVia: v.tipoVia ? v.nombreVia : null,
        tipoUrbanizacion: v.tipoUrbanizacion ?? null,
        nombreUrbanizacion: v.tipoUrbanizacion ? v.nombreUrbanizacion : null,
        manzana: v.tipoUrbanizacion ? v.manzana : null,
        lote: v.tipoUrbanizacion ? v.lote : null,
        piso: v.piso || null,
        interior: v.interior || null,
        direccionCompleta,
        latitud: v.latitud,
        longitud: v.longitud
      }
    };

    this.ventaService.registrarCliente(dto).subscribe({
      next: () => { alert('Cliente registrado exitosamente');
        this.form.reset();
        this.router.navigate(['/venta/servicio']);
      },
      error: err => alert(`Error al registrar: ${err.message}`)
    });
  }

  private buildDireccionCompleta(v: any):string{
    const parts: string[] = [];
    if (v.tipoVia) parts.push(`${v.tipoVia} ${v.nombreVia} ${v.numero}`);
    if (v.tipoUrbanizacion) parts.push(`${v.tipoUrbanizacion} ${v.nombreUrbanizacion} MZ ${v.manzana} LT ${v.lote}`);
    if (v.piso) parts.push(`PISO ${v.piso}`);
    if (v.interior) parts.push(`INT ${v.interior}`);
    return parts.join(' ');
  }

  dateFilterNacimiento = (date: Date | null): boolean => {
    if(!date){
      return false;
    }
    return date <= this.maxDate;
  }
}
