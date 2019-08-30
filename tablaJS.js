class Competidor{
  constructor(num, nom, est){
    this.numero = num;
    this.nombre = nom;
    this.estado = est;
  }
}
/*
document.getElementById("tabla").insertRow(-1).innerHTML = '<td>1</td><td>Hola</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
document.getElementById("tabla").insertRow(-1).innerHTML = '<td>2</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
document.getElementById("tabla").insertRow(-1).innerHTML = '<td>3</td><td>Hola</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
document.getElementById("tabla").insertRow(-1).innerHTML = '<td>4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
*/
/*
window.onload = function(){
var tabla = document.getElementById("tabla");
var botonesCrearFila = document.getElementsByClassName("Agregar");
console.log("El codigo...");

  function crearFila(evento){
    console.log("El codigo entra aquí");
    var nuevaFila = tabla.tBodies[0].insertRow(tabla.tBodies[0].rows.length);
    
    //var totalCeldas = nuevaFila.insertCell(tabla.tBodies[0]);

    document.getElementById("tabla").insertRow(-1).innerHTML = '<td>1</td><td>Hola</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
    document.getElementById("tabla").insertRow(-1).innerHTML = '<td>2</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';

    //var ultimaFila = tabla.tBodies[0].rows.length - 1;
    //var ultimaCeldaFila = totalCeldas - 1;

    //console.log(totalCeldas);

  } 

  for (var f = 0; f < tabla.tBodies[0].rows.length; f++) {
      tabla.tBodies[0].rows[f].setAttribute("data-fila", f);
  }

  for (var f in botonesCrearFila) {
      botonesCrearFila[f].onclick = crearFila;
  } 
}

*/