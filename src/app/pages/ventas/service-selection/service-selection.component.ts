import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

interface Turno{
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-service-selection',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule,
    MatRadioModule, MatSelectModule, CommonModule
  ],
  templateUrl: './service-selection.component.html',
  styleUrl: './service-selection.component.css'
})
export default class ServiceSelectionComponent {
  fechaInstalacion = new FormControl();
  minDateInstalacion!: Date;
  maxDateInstalacion!: Date;
  turnoSeleccionado = new FormControl('');
  turnosDisponibles: Turno[] = [];
  allTurnos: Turno[] = [
    { value: 'manana', viewValue: 'Mañana (8:00 - 12:00)'},
    { value: 'tarde', viewValue: 'Tarde (13:00 - 18:00)'},
  ];
  constructor(){
    this.calculateDateConstraints();
    console.log('Inicialmente turnosDisponibles:', this.turnosDisponibles);
    this.updateTurnosDisponibles(this.fechaInstalacion.value);
  }

  ngOnInit(): void {
    this.fechaInstalacion.setValue(this.minDateInstalacion);
    this.fechaInstalacion.valueChanges.subscribe(fechaSeleccionada => {
      this.updateTurnosDisponibles(fechaSeleccionada);
    })
  }
  calculateDateConstraints(): void{
    const now = new Date();
    const currentHour = now.getHours();
    //Si son más de las 18:00h, la fecha minima es mañana
    if(currentHour >= 18){
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
      this.minDateInstalacion = tomorrow;
    }else{
      this.minDateInstalacion = now;
    }
    //se calcula el último día del mes siguiente
    const nextMonth = new Date();
    nextMonth.setMonth(now.getMonth() + 2);
    nextMonth.setDate(0);
    this.maxDateInstalacion = nextMonth;
  }
  dateFilterInstalacion = (date: Date | null): boolean => {
    if(!date){
      return false;
    }
    return date >= this.minDateInstalacion && date <= this.maxDateInstalacion;
  }
  onFechaInstalacionChange(event: MatDatepickerInputEvent<Date>){
    console.log('Fecha de instalación seleccionada:', event.value);
    this.fechaInstalacion.setValue(event.value);
  }
  updateTurnosDisponibles(fechaSeleccionada: Date | null){
    this.turnosDisponibles = [...this.allTurnos];
    //si la fecha es hoy
    if(fechaSeleccionada){
      const now = new Date();
      const selectedDate = new Date(fechaSeleccionada);

      if(selectedDate.toDateString() === now.toDateString()){
        const currentHour = now.getHours();
        //si son más de las 13:00
        if(currentHour >= 13){
          this.turnosDisponibles = [];
        }
      }
    }
  }
  onTurnoChange(event: any) {
    console.log('Turno seleccionado:', event.value);
  }
}
