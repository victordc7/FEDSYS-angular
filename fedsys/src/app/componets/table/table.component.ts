import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  tabla = 'escogerRondas';
  jueces = [
    {numero: 1, nombre: 'Juan'},
    {numero: 2, nombre: 'Pedro'},
    {numero: 3, nombre: 'Luis'},
    {numero: 4, nombre: 'Ramon'},
    {numero: 5, nombre: 'Jorge'},
    // {numero: 6, nombre: 'Matias'},
    // {numero: 7, nombre: 'Laura'},
  ]
  competidores = [
    {numero: 1, nombre: 'Juan', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: 0},
    {numero: 2, nombre: 'Pedro', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: 0},
    {numero: 3, nombre: 'Luis', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: 0},
    {numero: 4, nombre: 'Ramon', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: 0},
    {numero: 5, nombre: 'Jorge', apellido: 'Lopez', estado: 'Barinas', resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: 0},
  ]
  posicionesEmpate = [];
  porcentaje1 = 50;
  clasificados = 2;
  nj: number;
  rondas = {eliminatoria: false, salida1: false, final: true}
  isCalc = false;
  constructor() { }

  ngOnInit() {
    this.nj = this.jueces.length + 2;
    this.competidores.forEach(competidor => {
      this.jueces.forEach((juez, index) => {
        competidor.resultados.push({numero: index + 1, libre: 0, comparacion: 0, juez: {libre:true, comparacion:true}})
      });
    });
  }

  calcResultadosEliminatoria() {
    this.isCalc = true;
    this.competidores.forEach(competidor => {
      competidor.total = 0;
      competidor.empate = 0;
      competidor.resultados.forEach(resultado => {
        if (resultado.libre === true) {
          competidor.total += 1;
        }
      });
    });
    this.competidores.sort(function (a, b) {
      if (a.total > b.total) {
        return -1;
      }
      if (a.total < b.total) {
        return 1;
      }
        a.empate += 1;
        b.empate += 1;
      return 0;
    });
    var lugar = 1;
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

  calcResultadosSalida1() {
    this.isCalc = true;
    this.reiciarTachados(this.competidores);
    if (this.jueces.length === 5 || this.jueces.length === 6) {
      this.calcularTotales(this.competidores, 1, 'libre');
    } else if (this.jueces.length >= 7 && this.jueces.length <= 9) {
      this.calcularTotales(this.competidores, 2, 'libre');
    } else {
      alert('El numero de jueces es invalido')
    }
    this.calcLugar(this.competidores);
    this.posicionesEmpate = [];
    this.competidores.map(competidor => {
      if (competidor.empate) {
        this.posicionesEmpate.push(competidor);
      }
    })
    if (this.posicionesEmpate.length > 0) {
      this.desempatar(this.posicionesEmpate);
    }
  }
  
  calcResultadosFinal() {
    this.isCalc = true;
    this.reiciarTachados(this.competidores);
    if (this.jueces.length === 5 || this.jueces.length === 6) {
      this.calcularTotales(this.competidores, 1, 'libre');
      this.calcularTotales(this.competidores, 1, 'comparacion');
    } else if (this.jueces.length >= 7 && this.jueces.length <= 9) {
      this.calcularTotales(this.competidores, 2, 'libre');
      this.calcularTotales(this.competidores, 2, 'comparacion');
    } else {
      alert('El numero de jueces es invalido')
    }
    this.calcLugar(this.competidores);
    this.posicionesEmpate = [];
    this.competidores.map(competidor => {
      if (competidor.empate) {
        this.posicionesEmpate.push(competidor);
      }
    })
    if (this.posicionesEmpate.length > 0) {
      this.desempatar(this.posicionesEmpate);
    }
  }

  calcularTotales(array, aTachar, tipo) {
    array.forEach(competidor => { 
      this.tacharResultados(aTachar, competidor, tipo);

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

      competidor.total = (competidor.subtotal1 * this.porcentaje1 / 100) + (competidor.subtotal2 * (100 - this.porcentaje1) / 100);
      console.log(competidor.total);
    });
  }

  tacharResultados(cantidad, competidor, tipo) {
    competidor.resultados.sort(function (a, b) {
      if (a[tipo] > b[tipo]) {
        return 1;
      }
      if (a[tipo] < b[tipo]) {
        return -1;
      }
      return 0;
    });
    for (let index = 0; index < cantidad; index++) {
      competidor.resultados[index].juez[tipo] = false;
      competidor.resultados[competidor.resultados.length - index - 1].juez[tipo] = false;  
    }
    competidor.resultados.sort(function (a, b) {
      if (a.numero > b.numero) {
        return 1;
      }
      if (a.numero < b.numero) {
        return -1;
      }
      return 0;
    });
  }

  calcLugar(array) {
    const empate = array[0].empate + 1;
    array.sort(function (a, b) {
      if (a.lugar > b.lugar) {
        return 1;
      }
      if (a.lugar < b.lugar) {
        return -1;
      }
      return 0;
    });
    let lugar = array[0].lugar;
    array.sort(function (a, b) {
      if (a.total > b.total) {
        return 1;
      }
      if (a.total < b.total) {
        return -1;
      }
        a.empate = empate;
        b.empate = empate;
      return 0;
    });
    array.forEach(competidor => {
      if (lugar === 0) {
        lugar ++
      }
      competidor.lugar = lugar;
      lugar ++
    })
    array.sort(function (a, b) {
      if (a.numero > b.numero) {
        return 1;
      }
      if (a.numero < b.numero) {
        return -1;
      }
      return 0;
    });
  }

  desempatar(posEmp) {
    if (this.jueces.length === 5 || this.jueces.length === 6) {
      if (posEmp[0].empate === 2 || this.tabla === 'salida1') {
        this.calcularTotales(posEmp, 2, 'libre');
      } else {
        this.calcularTotales(posEmp, 2, 'comparacion');
      } 
    } else if (this.jueces.length === 7 || this.jueces.length === 8) {
      if (posEmp[0].empate === 2 || this.tabla === 'salida1') {
        this.calcularTotales(posEmp, 3, 'libre');
      } else {
        this.calcularTotales(posEmp, 3, 'comparacion');
      } 
    } else if (this.jueces.length === 9) {
      if (posEmp[0].empate === 2 || this.tabla === 'salida1') {
        this.calcularTotales(posEmp, 4, 'libre');
      } else {
        this.calcularTotales(posEmp, 4, 'comparacion');
      }
    } else {
      alert('El numero de jueces es invalido')
    }
    this.calcLugar(posEmp);
    this.posicionesEmpate = [];
    posEmp.map(competidor => {
      if (competidor.empate === 2) {
        this.posicionesEmpate.push(competidor);
      }
    })
    if (this.posicionesEmpate.length > 0) {
      this.desempatar(this.posicionesEmpate);
    }
  }

  reiciarTachados(competidores) {
    competidores.forEach(competidor => {
      competidor.empate = 0;
      this.jueces.forEach((juez, index) => {
        competidor.resultados[index].juez.libre = true;
        competidor.resultados[index].juez.comparacion = true;
      });
    });
  }

  confirmarRondas() {
    if (this.rondas.eliminatoria) {
      this.tabla = 'eliminatoria';
      this.rondas.eliminatoria = false;
    } else if (this.rondas.salida1) {
      this.tabla = 'salida1';
      this.porcentaje1 = 100;
      this.rondas.salida1 = false;
    } else if (this.rondas.final) {
      this.tabla = 'final';
      this.porcentaje1 = 50;
    } else {
      alert('Porfavor seleccione almenos 1 ronda')
    }
  }

  descalificar() {
    this.competidores.sort(function (a, b) {
      if (a.lugar > b.lugar) {
        return -1;
      }
      if (a.lugar < b.lugar) {
        return 1;
      }
      return 0;
    });
    this.competidores.splice(0, this.competidores.length - this.clasificados);
    this.competidores.sort(function (a, b) {
      if (a.numero > b.numero) {
        return 1;
      }
      if (a.numero < b.numero) {
        return -1;
      }
      return 0;
    });
    this.competidores.forEach(competidor => {
      competidor.resultados = [];
      competidor.subtotal1 = 0;
      competidor.subtotal2 = 0;
      competidor.lugar = 0;
      competidor.empate = 0;
      this.jueces.forEach((juez, index) => {
        competidor.resultados.push({numero: index + 1, libre: 0, comparacion: 0, juez: {libre:true, comparacion:true}})
      });
    });
  }

  siguienteEtapa() {
    this.isCalc = false;
    this.confirmarRondas();
    this.descalificar();
  }

}
