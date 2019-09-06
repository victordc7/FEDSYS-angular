class Competidor{
  constructor(num, nom, est){
    this.numero = num;
    this.nombre = nom;
    this.estado = est;
  }
}

function addTable(){
  var myTableDiv = document.getElementById("tabla");
  var table = document.createElement('TABLE');
  var tableBody = document.createElement('TBODY');

  table.border = '1'
  table.appendChild(tableBody);

  var heading = new Array();
  heading[0] = "Competidores"
  heading[1] = "Pesos Libres"
  heading[2] = "Comparaciones"
  heading[3] = "Resultados"
  //heading[4] = "Total"

  var subHeading = new Array();
  subHeading[0] = "N°";
  subHeading[1] = "Nombre";
  subHeading[2] = "Estado";

  subHeading[3] = "Juez 1";
  subHeading[4] = "Juez 2";
  subHeading[5] = "Juez 3";
  subHeading[6] = "Juez 4";
  subHeading[7] = "Juez 5";
  subHeading[8] = "Juez 6";
  subHeading[9] = "Juez 7";
  subHeading[10] = "Juez 8";
  subHeading[11] = "Subcuenta";
  subHeading[12] = "Subcuenta 67";

  subHeading[13] = "Juez 1";
  subHeading[14] = "Juez 2";
  subHeading[15] = "Juez 3";
  subHeading[16] = "Juez 4";
  subHeading[17] = "Juez 5";
  subHeading[18] = "Juez 6";
  subHeading[19] = "Juez 7";
  subHeading[20] = "Juez 8";
  subHeading[21] = "Subcuenta";
  subHeading[22] = "Subcuenta 33";    

  subHeading[21] = "Cuenta Final";
  subHeading[22] = "Lugar";

  var stock = new Array();
  stock[0] = new Array("1", "Carlos González", "Zulia", "85.81", "987")
  stock[1] = new Array("2", "José Pérez", "DC", "85.81", "989")
  stock[2] = new Array("3", "Tomás Sanabria", "Nueva Esparta", "85.81", "990")
  stock[3] = new Array("4", "Alfredo Sosa", "Sucre", "85.81", "991")

 //COLUMNAS DE LA TABLA
  var tr = document.createElement('TR');
  tableBody.appendChild(tr);
  for (i = 0; i < heading.length; i++) {
      var th = document.createElement('TH');
      th.width = '75';
      th.appendChild(document.createTextNode(heading[i]));
      tr.appendChild(th);
  }

 //SUBCOLUMNAS DE LA TABLA
  var tr = document.createElement('TR');
  tableBody.appendChild(tr);
  for (i = 0; i < subHeading.length; i++) {
      var th = document.createElement('TH');
      th.width = '75';
      th.appendChild(document.createTextNode(subHeading[i]));
      tr.appendChild(th);
  }

  //FILAS DE LA TABLA
  for (i = 0; i < stock.length; i++) {
      var tr = document.createElement('TR');
      for (j = 0; j < stock[i].length; j++) {
          var td = document.createElement('TD');
          td.appendChild(document.createTextNode(stock[i][j]));
          tr.appendChild(td);
      }
      tableBody.appendChild(tr);
  }  
  myTableDiv.appendChild(table);
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