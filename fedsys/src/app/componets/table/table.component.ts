import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  jueces = [
    {numero: 1, nombre: 'Juan'},
    {numero: 2, nombre: 'Pedro'},
    {numero: 3, nombre: 'Luis'},
    {numero: 4, nombre: 'Ramon'},
    {numero: 5, nombre: 'Jorge'},
    {numero: 6, nombre: 'Matias'},
    {numero: 7, nombre: 'Laura'},
  ]
  competidores = [
    {numero: 1, nombre: 'Juan', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0},
    {numero: 2, nombre: 'Pedro', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0},
    {numero: 3, nombre: 'Luis', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0},
    {numero: 4, nombre: 'Ramon', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0},
    {numero: 5, nombre: 'Jorge', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0},
  ]
  porcentaje1 = 67;
  porcentaje2 = 33;
  nj: number;
  constructor() { }

  ngOnInit() {
    this.nj = this.jueces.length + 2;
    this.competidores.forEach(competidor => {
      this.jueces.forEach(juez => {
        competidor.resultados.push({libre: Math.floor(Math.random() * 10), comparacion: Math.floor(Math.random() * 10)})
      });
    });
  }

  calcResultados() {
    if (this.jueces.length === 5 || this.jueces.length === 6) {
      this.competidores.forEach(competidor => {
        const arrLibre = [];
        const arrComparacion = [];
        competidor.resultados.map(element => {
          arrLibre.push(Number(element.libre));
          arrComparacion.push(Number(element.comparacion));
        });
        arrLibre.sort();
        arrComparacion.sort();
        arrLibre.splice(0, 1);
        arrLibre.splice(-1, 1);
        arrComparacion.splice(0, 1);
        arrComparacion.splice(-1, 1);
        arrLibre.forEach(element => {
          competidor.subtotal1 += element;
        });
        arrComparacion.forEach(element => {
          competidor.subtotal2 += element;
        });
        competidor.total = (competidor.subtotal1 * this.porcentaje1 / 100) + (competidor.subtotal2 * this.porcentaje2 / 100);
        console.log(competidor.total);
      });
    } else if (this.jueces.length === 7 || this.jueces.length === 8) {
      this.competidores.forEach(competidor => {
        const arrLibre = [];
        const arrComparacion = [];
        competidor.resultados.map(element => {
          arrLibre.push(Number(element.libre));
          arrComparacion.push(Number(element.comparacion));
        });
        arrLibre.sort();
        arrComparacion.sort();
        arrLibre.splice(0, 2);
        arrLibre.splice(-2, 2);
        arrComparacion.splice(0, 2);
        arrComparacion.splice(-2, 2);
        arrLibre.forEach(element => {
          competidor.subtotal1 += element;
        });
        arrComparacion.forEach(element => {
          competidor.subtotal2 += element;
        });
        competidor.total = (competidor.subtotal1 * this.porcentaje1 / 100) + (competidor.subtotal2 * this.porcentaje2 / 100);
        console.log(competidor.total);
      });
    } else if (this.jueces.length === 9) {
      this.competidores.forEach(competidor => {
        const arrLibre = [];
        const arrComparacion = [];
        competidor.resultados.map(element => {
          arrLibre.push(Number(element.libre));
          arrComparacion.push(Number(element.comparacion));
        });
        arrLibre.sort();
        arrComparacion.sort();
        arrLibre.splice(0, 2);
        arrLibre.splice(-2, 2);
        arrComparacion.splice(0, 2);
        arrComparacion.splice(-2, 2);
        arrLibre.forEach(element => {
          competidor.subtotal1 += element;
        });
        arrComparacion.forEach(element => {
          competidor.subtotal2 += element;
        });
        competidor.total = (competidor.subtotal1 * this.porcentaje1 / 100) + (competidor.subtotal2 * this.porcentaje2 / 100);
        console.log(competidor.total);
      });
    } else {
      alert('El numero de jueces es invalido')
    }
  }

}
