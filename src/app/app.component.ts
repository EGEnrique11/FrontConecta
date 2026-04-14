import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-conecta';

  ngOnInit(): void {
    localStorage.removeItem('authToken'); // Eliminar token al inicio (solo para prueba)
    console.log('AppComponent initialized and authToken removed.');
  }
}
