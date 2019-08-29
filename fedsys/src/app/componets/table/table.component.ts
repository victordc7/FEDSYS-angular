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
    {numero: 1, nombre: 'Juan', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: false},
    {numero: 2, nombre: 'Pedro', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: false},
    {numero: 3, nombre: 'Luis', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: false},
    {numero: 4, nombre: 'Ramon', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: false},
    {numero: 5, nombre: 'Jorge', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: false},
  ]
  porcentaje1 = 67;
  porcentaje2 = 33;
  nj: number;
  constructor() { }

  ngOnInit() {
    this.nj = this.jueces.length + 2;
    this.competidores.forEach(competidor => {
      this.jueces.forEach((juez, index) => {
        competidor.resultados.push({numero: index + 1, libre: Math.floor(Math.random() * 10), comparacion: Math.floor(Math.random() * 10), juez: {libre:true, comparacion:true}})
      });
    });
  }

  calcResultados() {
    if (this.jueces.length === 5 || this.jueces.length === 6) {
      this.competidores.forEach(competidor => {
        // const arrLibre = [];
        // const arrComparacion = [];
        // competidor.resultados.map(element => {
        //   arrLibre.push(Number(element.libre));
        //   arrComparacion.push(Number(element.comparacion));
        // });
        // arrLibre.sort();
        // arrComparacion.sort();
        // arrLibre.splice(0, 1);
        // arrLibre.splice(-1, 1);
        // arrComparacion.splice(0, 1);
        // arrComparacion.splice(-1, 1);
        // competidor.subtotal1 = 0;
        // competidor.subtotal2 = 0;
        // arrLibre.forEach(element => {
        //   competidor.subtotal1 += element;
        // });
        // arrComparacion.forEach(element => {
        //   competidor.subtotal2 += element;
        // });
        competidor.resultados.sort(function (a, b) {
          if (a.libre > b.libre) {
            return 1;
          }
          if (a.libre < b.libre) {
            return -1;
          }
          return 0;
        });
        competidor.resultados[0].juez.libre = false;
        competidor.resultados[competidor.resultados.length - 1].juez.libre = false;
        console.log(competidor.resultados)

        competidor.resultados.sort(function (a, b) {
          if (a.comparacion > b.comparacion) {
            return 1;
          }
          if (a.comparacion < b.comparacion) {
            return -1;
          }
          return 0;
        });
        competidor.resultados[0].juez.comparacion = false;
        competidor.resultados[competidor.resultados.length - 1].juez.comparacion = false;

        competidor.resultados.sort(function (a, b) {
          if (a.numero > b.numero) {
            return 1;
          }
          if (a.numero < b.numero) {
            return -1;
          }
          return 0;
        });

        competidor.subtotal1 = 0;
        competidor.subtotal2 = 0;

        competidor.resultados.map(item => {
          if (item.juez.libre) {
            competidor.subtotal1 += Number(item.libre);
          }
          if (item.juez.comparacion) {
            competidor.subtotal2 += Number(item.comparacion);
          }
        })

        competidor.total = (competidor.subtotal1 * this.porcentaje1 / 100) + (competidor.subtotal2 * this.porcentaje2 / 100);
        console.log(competidor.total);
      });
      this.calcLugar();
    } else if (this.jueces.length === 7 || this.jueces.length === 8) {
      this.competidores.forEach(competidor => {
        competidor.resultados.sort(function (a, b) {
          if (a.libre > b.libre) {
            return 1;
          }
          if (a.libre < b.libre) {
            return -1;
          }
          return 0;
        });
        competidor.resultados[0].juez.libre = false;
        competidor.resultados[1].juez.libre = false;
        competidor.resultados[competidor.resultados.length - 1].juez.libre = false;
        competidor.resultados[competidor.resultados.length - 2].juez.libre = false;
        console.log(competidor.resultados)

        competidor.resultados.sort(function (a, b) {
          if (a.comparacion > b.comparacion) {
            return 1;
          }
          if (a.comparacion < b.comparacion) {
            return -1;
          }
          return 0;
        });
        competidor.resultados[0].juez.comparacion = false;
        competidor.resultados[1].juez.comparacion = false;
        competidor.resultados[competidor.resultados.length - 1].juez.comparacion = false;
        competidor.resultados[competidor.resultados.length - 2].juez.comparacion = false;

        competidor.resultados.sort(function (a, b) {
          if (a.numero > b.numero) {
            return 1;
          }
          if (a.numero < b.numero) {
            return -1;
          }
          return 0;
        });

        competidor.subtotal1 = 0;
        competidor.subtotal2 = 0;

        competidor.resultados.map(item => {
          if (item.juez.libre) {
            competidor.subtotal1 += Number(item.libre);
          }
          if (item.juez.comparacion) {
            competidor.subtotal2 += Number(item.comparacion);
          }
        })

        competidor.total = (competidor.subtotal1 * this.porcentaje1 / 100) + (competidor.subtotal2 * this.porcentaje2 / 100);
        console.log(competidor.total);
      });
      this.calcLugar();
    } else if (this.jueces.length === 9) {
      this.competidores.forEach(competidor => {
        competidor.resultados.sort(function (a, b) {
          if (a.libre > b.libre) {
            return 1;
          }
          if (a.libre < b.libre) {
            return -1;
          }
          return 0;
        });
        competidor.resultados[0].juez.libre = false;
        competidor.resultados[1].juez.libre = false;
        competidor.resultados[competidor.resultados.length - 1].juez.libre = false;
        competidor.resultados[competidor.resultados.length - 2].juez.libre = false;
        console.log(competidor.resultados)

        competidor.resultados.sort(function (a, b) {
          if (a.comparacion > b.comparacion) {
            return 1;
          }
          if (a.comparacion < b.comparacion) {
            return -1;
          }
          return 0;
        });
        competidor.resultados[0].juez.comparacion = false;
        competidor.resultados[1].juez.comparacion = false;
        competidor.resultados[competidor.resultados.length - 1].juez.comparacion = false;
        competidor.resultados[competidor.resultados.length - 2].juez.comparacion = false;

        competidor.resultados.sort(function (a, b) {
          if (a.numero > b.numero) {
            return 1;
          }
          if (a.numero < b.numero) {
            return -1;
          }
          return 0;
        });

        competidor.subtotal1 = 0;
        competidor.subtotal2 = 0;

        competidor.resultados.map(item => {
          if (item.juez.libre) {
            competidor.subtotal1 += Number(item.libre);
          }
          if (item.juez.comparacion) {
            competidor.subtotal2 += Number(item.comparacion);
          }
        })

        competidor.total = (competidor.subtotal1 * this.porcentaje1 / 100) + (competidor.subtotal2 * this.porcentaje2 / 100);
        console.log(competidor.total);
      });
      this.calcLugar();
    } else {
      alert('El numero de jueces es invalido')
    }
  }

  calcLugar(){
    this.competidores.sort(function (a, b) {
      if (a.total > b.total) {
        return 1;
      }
      if (a.total < b.total) {
        return -1;
      }
        a.empate = true;
        b.empate = true;
      return 0;
    });
    let lugar = 1;
    this.competidores.forEach(competidor => {
      competidor.lugar = lugar;
      lugar ++
    })
    this.competidores.sort(function (a, b) {
      if (a.numero > b.numero) {
        return 1;
      }
      if (a.numero < b.numero) {
        return -1;
      }
      return 0;
    });
  }

}
