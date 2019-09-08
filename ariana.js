
var jueces = [" juez 1" ," juez 2" ," juez 3" ," juez 4" ," juez 5" ," juez 6" ," juez 7" ," juez 8" ," juez 9"];
var puntajes = [0, 3, 2, 5, 3];
var puntajes2 = [4, 3, 1, 5, 3];
var w = 0; //variable de porcentaje poses libres
var w2 =0; //variable de porcentaje comparaciones
numeroDeJueces = 5;
numeroDeJueces2 = 5;
v = PuntajesDependeDeNroDeJueces(numeroDeJueces, puntajes); //Subcuenta poses libres
var v2 = PuntajesDependeDeNroDeJueces( numeroDeJueces2, puntajes2); //Subcuenta comparaciones
var tblBody = document.createElement("tbody");


var total3 = v + v2;
document.getElementById("resultados").innerHTML="RESULTADOS = "+total3;

var td1 = document.getElementById("primerJ"); //Jueces de poses libres
  var tabla1   = document.createElement("table");
  var fila = document.createElement("tr");
  for (var k = 0 ; k < numeroDeJueces; k++ )
   {
    var celdita = document.createElement("td");  var textoCelda = document.createTextNode(jueces[k]); celdita.appendChild(textoCelda);   fila.appendChild(celdita);
   }
  tblBody.appendChild(fila);
  var fila = document.createElement("tr");
  for (var k = 0 ; k < numeroDeJueces; k++ )
   {
    var celdita = document.createElement("td");  var textoCelda = document.createTextNode(puntajes[k]); celdita.appendChild(textoCelda);  fila.appendChild(celdita);
   }
  tblBody.appendChild(fila);
  tabla1.appendChild(tblBody);
  td1.appendChild(tabla1);
  tabla1.setAttribute("border", 1);
//   console.log(td1);

document.getElementById("SC1").innerHTML="SUBCUENTA = " + v //Valor de Subcuenta poses libres

var total1 = (v*w/100);
 document.getElementById("SC11").innerHTML="SUBCUENTA " + w + "%" + " = " + total1 //valor de Subcuenta porcentaje poses libres

var td2 = document.getElementById("SegundoJ"); //Jueces de Comparaciones
   var tabla   = document.createElement("table");
   var tblBody = document.createElement("tbody");
   var fila = document.createElement("tr");
   for (var k = 0 ; k < numeroDeJueces; k++ )
    {
     var celdita = document.createElement("td");  var textoCelda = document.createTextNode(jueces[k]); celdita.appendChild(textoCelda);   fila.appendChild(celdita);
    }
   tblBody.appendChild(fila);
   var fila = document.createElement("tr");
   for (var k = 0 ; k < numeroDeJueces; k++ )
    {
     var celdita = document.createElement("td");  var textoCelda = document.createTextNode(puntajes2[k]); celdita.appendChild(textoCelda);  fila.appendChild(celdita);
    }
   tblBody.appendChild(fila);
   tabla.appendChild(tblBody);
   td2.appendChild(tabla);
   tabla.setAttribute("border", 1);

document.getElementById("SC2").innerHTML="SUBCUENTA =" + v2 //Valor de Subcuenta Comparaciones

var total2 =  (v*w2/100);
document.getElementById("SC22").innerHTML="SUBCUENTA " + w2 + "%" + " = " + total2 //valor de Subcuenta porcentaje comparaciones


function PuntajesDependeDeNroDeJueces (numeroDeJueces, vectorpuntajes)
{
  if ( numeroDeJueces<=6)
    {
      var vec1 = EliminarAltos(vectorpuntajes);
      var vec2 = EliminarBajos(vec1);
      var total = sumarVector(vec2);
     }
  if (numeroDeJueces>6)
     {
      var vec1 = EliminarAltos(vectorpuntajes);
      var vec2 = EliminarAltos(vec1);
      var vec3 = EliminarBajos(vec2);
      var vec4 = EliminarBajos(vec3);
      var total = sumarVector(vec4);
     }
  return total ;
}

function sumarVector(vector)
 {
    var s = 0 ;
    for (var i=0; i < vector.length; i++)
     {
      s = s + vector[i];
     }
    return s;
 }

function EliminarAltos(vector)
 {
   mayor = vector[0]; var puesto=0;
    for (var i=1; i < vector.length; i++)
     {
       if (mayor < vector[i])
        {
          mayor = vector[i];
          puesto = i;
        }
     }
    vector.splice(puesto,1);
  return vector;
}

function EliminarBajos(vector)
{
  menor = vector[0]; var puesto=0;
   for (var i=1; i < vector.length; i++)
    {
      if (menor > vector[i])
       {
         menor = vector[i];
         puesto = i;
       }
    }
    vector.splice(puesto,1);
  return vector;
}
