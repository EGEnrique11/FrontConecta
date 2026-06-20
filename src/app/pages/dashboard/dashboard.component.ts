import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { LucideAngularModule, Users, FileText, TrendingDown, DollarSign, Activity, Briefcase, Check} from 'lucide-angular';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DashboardStateService } from '../../features/dashboard/services/dashboard-state.service';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, LucideAngularModule, NgxSkeletonLoaderModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent implements OnInit {
  readonly state = inject(DashboardStateService);

  // Icons de Lucide
  readonly UsersIcon = Users;
  readonly CheckIcon = Check;
  readonly FileTextIcon = FileText;
  readonly TrendingDownIcon = TrendingDown;
  readonly DollarSignIcon = DollarSign;
  readonly ActivityIcon = Activity;
  readonly BriefcaseIcon = Briefcase;

  private readonly meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  
  public lineChartType: ChartType = 'line';
  public lineChartData = computed<ChartConfiguration['data']>(() => {
    const data = this.state.crecimientoMensual();
    
    const sorted = [...data].sort((a, b) => {
      if (a.anio !== b.anio) return a.anio - b.anio;
      return a.mes - b.mes;
    });

    return {
      labels: sorted.map(d => `${this.meses[d.mes - 1]} ${d.anio}`),
      datasets: [
        {
          data: sorted.map(d => d.cantidad),
          label: 'Nuevos Clientes',
          backgroundColor: 'rgba(0, 141, 146, 0.2)',
          borderColor: 'rgba(0, 141, 146, 1)',
          pointBackgroundColor: 'rgba(0, 141, 146, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(0, 141, 146, 0.8)',
          fill: 'origin',
        }
      ]
    };
  });

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4 }
    },
    plugins: {
      legend: { display: true, position: 'top' }
    }
  };

  // Doughnut Chart (Ingresos vs Deuda)
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData = computed<ChartConfiguration['data']>(() => {
    const finanzas = this.state.finanzasDeudaIngreso();
    return {
      labels: ['Ingresos Realizados', 'Deudas y Mora'],
      datasets: [
        {
          data: finanzas ? [finanzas.ingresosRealizados, finanzas.deudasYMora] : [0, 0],
          backgroundColor: ['#10b981', '#ef4444'],
          hoverBackgroundColor: ['#059669', '#dc2626']
        }
      ]
    };
  });

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' }
    }
  };

  ngOnInit(): void {
    this.state.loadAllDashboardData();
    this.state.loadCrecimientoMensual();
  }

  //Global
  applyGlobalFilter(inicio: string, fin: string): void{
    if (inicio && fin){
      this.state.actualizarRangoFechasGlobal(inicio, fin);
    }
  }
  //Crecimiento Mensual
  applyCrecimientoFilter(inicio: string, fin: string): void{
    if(inicio && fin){
      this.state.actualizarRangoFechasCrecimiento(inicio, fin);
    }
  }

  exportarProductividadExcel(): void {
    this.state.exportarProductividad();
  }

  exportarVendedoresExcel(): void {
    this.state.exportarVendedores();
  }
}
