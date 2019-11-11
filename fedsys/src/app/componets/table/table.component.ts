import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Alert } from 'selenium-webdriver';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  public textarea;
  public textareaResult;
  tabla = 'escogerRondas';
  numeroJueces = 9;
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
    {athlete: 1, firstName: 'Juan', lastName: 'Lopez', city: 'Barinas', age: 23, personalID: 1321, gender: 'male', subcategory: {_id: "3124124321",number: 1, name: 'categoria 1', parent:"124123412"}, resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: 0},
    {athlete: 2, firstName: 'Pedro', lastName: 'Lopez', city: 'Barinas', age: 23, personalID: 1322, gender: 'male', subcategory: {_id: "3124124321",number: 1, name: 'categoria 1', parent:"124123412"}, resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: 0},
    {athlete: 3, firstName: 'Luis', lastName: 'Lopez', city: 'Barinas', age: 23, personalID: 1323, gender: 'male', subcategory: {_id: "31241243213",number: 2, name: 'categoria 2', parent:"124123412"}, resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: 0},
    {athlete: 4, firstName: 'Ramon', lastName: 'Lopez', city: 'Barinas', age: 23, personalID: 1324, gender: 'male', subcategory: {_id: "31241243212",number: 4, name: 'categoria 4', parent:"124123412"}, resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: 0},
    {athlete: 5, firstName: 'Jorge', lastName: 'Lopez', city: 'Barinas', age: 23, personalID: 1325, gender: 'male', subcategory: {_id: "3124124321",number: 1, name: 'categoria 1', parent:"124123412"}, resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: 0}
  ]

  competidoresPorLugar = [];
  posicionesEmpate = [];
  porcentaje1 = 33;
  clasificados = 15;
  nj: number;
  rondas = {eliminatoria: false, salida1: false, final1: false, final2: false}
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
      return 0;
    });
    var lugar = 1;
    let puntosLimite: number;
    this.competidores.forEach(competidor => {
      competidor.lugar = lugar;
      if (competidor.lugar === this.clasificados) {
        puntosLimite = competidor.total;
      }
      lugar ++
    })
    this.competidores.forEach(competidor => {
      if (competidor.total === puntosLimite) {
        competidor.empate = 1;
      }
    });
    this.competidores.sort(function (a, b) {
      if (Number(a.athlete) > Number(b.athlete)) {
        return 1;
      }
      if (Number(a.athlete) < Number(b.athlete)) {
        return -1;
      }
      return 0;
    });
    this.ordenarPorLugar()
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
    this.ordenarPorLugar()
    let toDesempatar = [];
    let puntos: number;
    this.posicionesEmpate.sort(function (a, b) {
      if (a.total > b.total) {
        return 1;
      }
      if (a.total < b.total) {
        return -1;
      }
      return 0;
    });
    this.posicionesEmpate.forEach(competidor => {
      if (competidor.total === puntos) {
        toDesempatar.push(competidor)
      } else {
        if (puntos) {
          this.desempatar(toDesempatar); 
        }
        toDesempatar = [];
        puntos = competidor.total;
        toDesempatar.push(competidor)
      }
    });
    if (puntos) {
      this.desempatar(toDesempatar); 
    }
    // if (this.posicionesEmpate.length > 0) {
    //   this.desempatar(this.posicionesEmpate);
    // }
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
    this.ordenarPorLugar()
    let toDesempatar = [];
    let puntos: number;
    this.posicionesEmpate.forEach(competidor => {
      if (competidor.total === puntos) {
        toDesempatar.push(competidor)
      } else {
        if (puntos) {
          this.desempatar(toDesempatar); 
        }
        toDesempatar = [];
        puntos = competidor.total;
        toDesempatar.push(competidor)
      }
    });
    if (puntos) {
      this.desempatar(toDesempatar); 
    }
    // if (this.posicionesEmpate.length > 0) {
    //   this.desempatar(this.posicionesEmpate);
    // }
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
      console.log('lugar', lugar);
      lugar ++
    })
    array.sort(function (a, b) {
      if (Number(a.athlete) > Number(b.athlete)) {
        return 1;
      }
      if (Number(a.athlete) < Number(b.athlete)) {
        return -1;
      }
      return 0;
    });
  }

  desempatar(posEmp) {
    console.log(posEmp.slice());
    if (this.jueces.length === 5 || this.jueces.length === 6) {
      if (posEmp[0].empate === 2 || this.tabla === 'salida1' || this.tabla === 'final1') {
        this.calcularTotales(posEmp, 2, 'libre');
      } else {
        this.calcularTotales(posEmp, 2, 'comparacion');
      }
    } else if (this.jueces.length === 7 || this.jueces.length === 8) {
      if (posEmp[0].empate === 2 || this.tabla === 'salida1' || this.tabla === 'final1') {
        this.calcularTotales(posEmp, 3, 'libre');
      } else {
        this.calcularTotales(posEmp, 3, 'comparacion');
      }
    } else if (this.jueces.length === 9) {
      if (posEmp[0].empate === 2 || this.tabla === 'salida1' || this.tabla === 'final1') {
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
    if (this.posicionesEmpate.length > 0 && this.tabla === 'final2') {
      this.desempatar(this.posicionesEmpate);
    } else if (this.tabla !== 'eliminatoria') {
      this.ordenarPorLugar()
    }
  }

  ordenarPorLugar() {
    this.competidoresPorLugar = this.competidores.slice();
    this.competidoresPorLugar.sort(function (a, b) {
      if (a.lugar > b.lugar) {
        return 1;
      }
      if (a.lugar < b.lugar) {
        return -1;
      }
      return 0;
    });
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
    } else if (this.rondas.final1) {
      this.tabla = 'final1';
      this.porcentaje1 = 100;
      this.rondas.final1 = false;
    } else if (this.rondas.final2) {
      this.tabla = 'final2';
      this.porcentaje1 = 33;
      this.rondas.final2 = false;
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
    this.competidores.forEach(competidor => {
      this.competidores.splice(0, this.competidores.length - this.clasificados);
    });
    this.competidores.sort(function (a, b) {
      if (Number(a.athlete) > Number(b.athlete)) {
        return 1;
      }
      if (Number(a.athlete) < Number(b.athlete)) {
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

  splitTable(){
    this.competidores = [];
    this.jueces = [];
    console.log(this.textarea);
    const line = this.textarea.split(/(\n)/);
    const word = [];
    for (let i = 1; i < line.length; i++) {
      line.splice(i, 1);
    }
    if (line[line.length - 1] === "") {
      line.splice(-1, 1);
    }
    for (let i = 0; i < line.length; i++) {
      const array = line[i].slice()
      word.push(array.split('	'));
    }
    console.log(word);
    word.forEach(competitor => {
      this.competidores.push({athlete: competitor[0], firstName: competitor[1], lastName: '', city: competitor[2], age: 0, personalID: 0, gender: 'male', subcategory: {_id: "3124124321",number: 1, name: 'categoria 1', parent:"124123412"}, resultados: [], subtotal1: 0, subtotal2: 0, total: 0, lugar: 0, empate: 0})
    });
    for (let index = 0; index < this.numeroJueces; index++) {
      this.jueces.push({numero: (index + 1), nombre: ''})
    }
    this.nj = this.jueces.length + 2;
    this.competidores.forEach(competidor => {
      this.jueces.forEach((juez, index) => {
        competidor.resultados.push({numero: index + 1, libre: null, comparacion: null, juez: {libre:true, comparacion:true}})
      });
    });
    this.competidores.sort(function (a, b) {
      if (Number(a.athlete) > Number(b.athlete)) {
        return 1;
      }
      if (Number(a.athlete) < Number(b.athlete)) {
        return -1;
      }
      return 0;
    });
  }

  splitResults() {
    console.log(this.textareaResult);
    const line = this.textareaResult.split(/(\n)/);
    let word = [];
    for (let i = 1; i < line.length; i++) {
      line.splice(i, 1);
    }
    if (line[line.length - 1] === "") {
      line.splice(-1, 1);
    }
    for (let i = 0; i < line.length; i++) {
      const array = line[i].slice()
      word.push(array.split('	'));
    }

    for (let i = 0; i < line.length; i++) {
      for (let index = 0; index < this.numeroJueces; index++) {
        this.competidores[i].resultados[index].comparacion = +word[i][index];
      }
    }
    console.log(this.competidores[1].resultados);
  }

  regresar(){
    this.tabla = 'escogerRondas';
    // this.competidores = [];
    // this.jueces = [];
    this.textarea = "";
    this.textareaResult = "";
    this.isCalc = false;
  }

  inventarResultados(){
    this.competidores.forEach(competitor => {
      this.jueces.forEach((juez, index) => {
        competitor.resultados[index].libre = Math.floor(Math.random() * this.competidores.length) + 1;
        competitor.resultados[index].comparacion = Math.floor(Math.random() * this.competidores.length) + 1;
      });
    });
  }
}
