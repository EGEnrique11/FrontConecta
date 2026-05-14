import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DespachoHttpService } from '../../../core/infrastructure/despacho-http.service';
import { DespachoStateService } from '../../../features/despacho/services/despacho-state.service';

import { AuthService } from '../../../core/auth/auth.service';

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
  private authService = inject(AuthService);

  fechaSeleccionada = signal<string>(new Date().toISOString().split('T')[0]);

  ngOnInit(): void {
    this.loadAgenda();
  }

  loadAgenda() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.httpService.obtenerAgendaTecnico(userId, this.fechaSeleccionada()).subscribe({
      next: (data) => this.state.setDelDia(data),
      error: (err) => console.error(err)
    });
  }

  onDateChange() {
    this.loadAgenda();
  }

  onIniciarTrabajo(id: number) {
    this.httpService.iniciarInstalacion(id).subscribe({
      next: () => {
        this.loadAgenda();
      },
      error: (err) => alert("Error al iniciar instalación: " + (err.error?.message || "Error interno"))
    });
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
