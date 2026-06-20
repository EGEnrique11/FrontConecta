import { inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { DashboardHttpService } from '../../../core/infrastructure/dashboard-http.service';
import { 
    ResumenDashboard, 
    FinanzasDeudaIngreso, 
    EfectividadMora, 
    TasaInstalacion, 
    CrecimientoMensual, 
    ProductividadTecnica, 
    RendimientoVendedor 
} from '../../../core/models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {
  private readonly http = inject(DashboardHttpService);

  readonly isLoading = signal<boolean>(true);
  
  readonly resumen = signal<ResumenDashboard | null>(null);
  readonly finanzasDeudaIngreso = signal<FinanzasDeudaIngreso | null>(null);
  readonly efectividadMora = signal<EfectividadMora | null>(null);
  readonly tasaInstalacion = signal<TasaInstalacion | null>(null);
  readonly productividadTecnica = signal<ProductividadTecnica[]>([]);
  readonly rendimientoVendedores = signal<RendimientoVendedor[]>([]);
  //Crecimiento Mensual independiente
  readonly crecimientoLoading = signal<boolean>(true);
  readonly crecimientoMensual = signal<CrecimientoMensual[]>([]);
  readonly crecimientoFechaInicio = signal<string>(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  readonly crecimientoFechaFin = signal<string>(format(new Date(), 'yyyy-MM-dd'));

  readonly instalacionesEstados = signal<Record<string, number> | null>(null);
  readonly instalacionesLoading = signal<boolean>(true);
  
  readonly fechaInicio = signal<string>(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  readonly fechaFin = signal<string>(format(new Date(), 'yyyy-MM-dd'));

  loadAllDashboardData(): void {
    this.isLoading.set(true);

    const inicioStr = this.fechaInicio();
    const finStr = this.fechaFin();

    forkJoin({
      resumen: this.http.getResumen(inicioStr, finStr),
      finanzas: this.http.getFinanzasIngresosVsDeuda(inicioStr, finStr),
      efectividad: this.http.getFinanzasEfectividad(inicioStr, finStr),
      instalacion: this.http.getOperacionesTasaInstalacion(inicioStr, finStr),
      //crecimiento: this.http.getRendimientoCrecimiento(inicioStr, finStr),
      productividad: this.http.getOperacionesProductividad(inicioStr, finStr),
      vendedores: this.http.getRendimientoVendedores(inicioStr, finStr)
    }).subscribe({
      next: (data) => {
        this.resumen.set(data.resumen);
        this.finanzasDeudaIngreso.set(data.finanzas);
        this.efectividadMora.set(data.efectividad);
        this.tasaInstalacion.set(data.instalacion);
        //this.crecimientoMensual.set(data.crecimiento);
        this.productividadTecnica.set(data.productividad);
        this.rendimientoVendedores.set(data.vendedores);
        
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading dashboard data', err);
        this.isLoading.set(false);
      }
    });

    this.loadInstalacionesEstados();
  }

  //Carga para Crecimiento Mensual
  loadCrecimientoMensual():void{
    this.crecimientoLoading.set(true);
    this.http.getRendimientoCrecimiento(this.crecimientoFechaInicio(), this.crecimientoFechaFin())
    .subscribe({
      next: (data) => {
        this.crecimientoMensual.set(data);
        this.crecimientoLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading crecimiento data', err);
        this.crecimientoLoading.set(false);
      }
    })
  }
  //Metodo para actualizar Crecimiento Mensual
  actualizarRangoFechasCrecimiento(inicio: string, fin: string):void{
    this.crecimientoFechaInicio.set(inicio);
    this.crecimientoFechaFin.set(fin);
    this.loadCrecimientoMensual();
  }
  //Carga Global
  loadInstalacionesEstados(): void {
    this.instalacionesLoading.set(true);
    this.http.getInstalacionesEstados(this.fechaInicio(), this.fechaFin())
      .subscribe({
        next: (data) => {
          this.instalacionesEstados.set(data);
          this.instalacionesLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading instalaciones estados', err);
          this.instalacionesLoading.set(false);
        }
      });
  }
  //Carga Global de fechas
  actualizarRangoFechasGlobal(inicio: string, fin: string): void {
    this.fechaInicio.set(inicio);
    this.fechaFin.set(fin);
    this.loadAllDashboardData();
  }

  // --- Exportación a Excel ---
  readonly isExportingProductividad = signal<boolean>(false);
  readonly isExportingVendedores = signal<boolean>(false);

  exportarProductividad(): void {
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();
    this.isExportingProductividad.set(true);
    this.http.exportarProductividadExcel(inicio, fin).subscribe({
      next: (blob: Blob) => {
        this.descargarArchivo(blob, `reporte_productividad_${inicio}_${fin}.xlsx`);
      },
      error: (err) => console.error('Error al exportar productividad:', err),
      complete: () => this.isExportingProductividad.set(false)
    });
  }

  exportarVendedores(): void {
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();
    this.isExportingVendedores.set(true);
    this.http.exportarVendedoresExcel(inicio, fin).subscribe({
      next: (blob: Blob) => {
        this.descargarArchivo(blob, `reporte_vendedores_${inicio}_${fin}.xlsx`);
      },
      error: (err) => console.error('Error al exportar vendedores:', err),
      complete: () => this.isExportingVendedores.set(false)
    });
  }

  private descargarArchivo(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
