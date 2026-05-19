import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FacturacionHttpService } from '../../../../../core/infrastructure/facturacion-http.service';
import { DocumentoHttpService } from '../../../../../core/infrastructure/documento-http.service';
import { ReciboListDTO } from '../../../../../core/models/facturacion/facturacion.model';

@Component({
  selector: 'app-tab-facturacion',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './tab-facturacion.component.html',
  styleUrl: './tab-facturacion.component.css'
})
export class TabFacturacionComponent implements OnInit {
  clienteId = input.required<number>();
  activeSubTab = signal<string>('BOLETAS');
  
  data = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  // Pagination for Boletas
  totalElements = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);

  private facturacionService = inject(FacturacionHttpService);
  private documentoService = inject(DocumentoHttpService);

  ngOnInit(): void {
    this.loadData();
  }

  setSubTab(tab: string): void{
    this.activeSubTab.set(tab);
    this.pageIndex.set(0);
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.data.set([]);
    
    if (this.activeSubTab() === 'BOLETAS') {
      this.facturacionService.obtenerRecibosPorCliente(this.clienteId(), this.pageIndex(), this.pageSize()).subscribe({
        next: (res) => {
          this.data.set(res.content);
          this.totalElements.set(res.totalElements);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching boletas', err);
          this.isLoading.set(false);
        }
      });
    } else if (this.activeSubTab() === 'DOCUMENTOS') {
      this.facturacionService.obtenerDocumentosPorCliente(this.clienteId()).subscribe({
        next: (res) => {
          this.data.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching documentos', err);
          this.isLoading.set(false);
        }
      });
    } else {
      // SALDOS
      this.isLoading.set(false);
      // Dummy behavior for Saldos since there is no specific endpoint defined yet.
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadData();
  }

  descargarPdf(reciboId: number) {
    this.documentoService.downloadReciboPdf(reciboId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Recibo_${reciboId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
