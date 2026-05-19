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
  readonly crecimientoMensual = signal<CrecimientoMensual[]>([]);
  readonly productividadTecnica = signal<ProductividadTecnica[]>([]);
  readonly rendimientoVendedores = signal<RendimientoVendedor[]>([]);

  readonly instalacionesEstados = signal<Record<string, number> | null>(null);
  readonly instalacionesLoading = signal<boolean>(true);
  
  readonly filtroInstalacionesInicio = signal<string>(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  readonly filtroInstalacionesFin = signal<string>(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  loadAllDashboardData(): void {
    this.isLoading.set(true);

    const now = new Date();
    const inicioStr = format(startOfMonth(now), 'yyyy-MM-dd');
    const finStr = format(endOfMonth(now), 'yyyy-MM-dd');

    forkJoin({
      resumen: this.http.getResumen(),
      finanzas: this.http.getFinanzasIngresosVsDeuda(),
      efectividad: this.http.getFinanzasEfectividad(),
      instalacion: this.http.getOperacionesTasaInstalacion(),
      crecimiento: this.http.getRendimientoCrecimiento(),
      productividad: this.http.getOperacionesProductividad(),
      vendedores: this.http.getRendimientoVendedores(inicioStr, finStr)
    }).subscribe({
      next: (data) => {
        this.resumen.set(data.resumen);
        this.finanzasDeudaIngreso.set(data.finanzas);
        this.efectividadMora.set(data.efectividad);
        this.tasaInstalacion.set(data.instalacion);
        this.crecimientoMensual.set(data.crecimiento);
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

  loadInstalacionesEstados(): void {
    this.instalacionesLoading.set(true);
    this.http.getInstalacionesEstados(this.filtroInstalacionesInicio(), this.filtroInstalacionesFin())
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

  actualizarFiltrosInstalaciones(inicio: string, fin: string): void {
    this.filtroInstalacionesInicio.set(inicio);
    this.filtroInstalacionesFin.set(fin);
    this.loadInstalacionesEstados();
  }
}
