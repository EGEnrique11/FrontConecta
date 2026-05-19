import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagoStateService {
  readonly isLoading = signal<boolean>(false);

  setLoading(state: boolean): void {
    this.isLoading.set(state);
  }
}
