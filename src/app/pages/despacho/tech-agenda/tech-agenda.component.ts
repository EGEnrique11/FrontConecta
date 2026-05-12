import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DespachoHttpService } from '../../../core/infrastructure/despacho-http.service';
import { DespachoStateService } from '../../../features/despacho/services/despacho-state.service';

@Component({
  selector: 'app-tech-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tech-agenda.component.html',
  styleUrl: './tech-agenda.component.css'
})
export default class TechAgendaComponent implements OnInit {
  private httpService = inject(DespachoHttpService);
  public state = inject(DespachoStateService);

  currentDate = new Date();
  mesSelect = signal<number>(this.currentDate.getMonth() + 1);
  anioSelect = signal<number>(this.currentDate.getFullYear());

  setMesSelect(val: number) {
    this.mesSelect.set(val);
  }

  setAnioSelect(val: number) {
    this.anioSelect.set(val);
  }

  ngOnInit(): void {
    this.loadAgenda();
  }

  loadAgenda() {
    this.httpService.obtenerAgendaTecnico(this.mesSelect(), this.anioSelect()).subscribe({
      next: (data) => this.state.setDelDia(data),
      error: (err) => console.error(err)
    });
  }

  onDateChange() {
    this.loadAgenda();
  }

  openMaps(direccion: string) {
    // Basic fallback to Google Maps search since we might not have lat/lng directly in the basic pending DTO
    // If the DTO had lat/lng we would use: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    const query = encodeURIComponent(direccion);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }

  getMeses() {
    return [
      { v: 1, text: 'Enero' }, { v: 2, text: 'Febrero' }, { v: 3, text: 'Marzo' },
      { v: 4, text: 'Abril' }, { v: 5, text: 'Mayo' }, { v: 6, text: 'Junio' },
      { v: 7, text: 'Julio' }, { v: 8, text: 'Agosto' }, { v: 9, text: 'Septiembre' },
      { v: 10, text: 'Octubre' }, { v: 11, text: 'Noviembre' }, { v: 12, text: 'Diciembre' }
    ];
  }

  getAnios() {
    const current = new Date().getFullYear();
    return [current - 1, current, current + 1];
  }
}
