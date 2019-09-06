
var jueces = [" juez 1" ," juez 2" ," juez 3" ," juez 4" ," juez 5" ," juez 6" ," juez 7" ," juez 8" ," juez 9"];
var puntajes = [0, 3, 2, 5, 3];
var puntajes2 = [4, 3, 1, 5, 3];
var w = 0;
var w1 =0;
numeroDeJueces = 5;
numeroDeJueces2 = 5;

  var td1 = document.getElementById("primerJ"); //Jueces de poses libres
  var tblBody = document.createElement("tbody");
  for (var k = 0 ; k < numeroDeJueces; k++ )
   {
        var celdita = document.createElement("td");  var textoCelda = document.createTextNode(jueces[k]); celdita.appendChild(textoCelda);  tblBody.appendChild(celdita); td1.appendChild(tblBody);
   }

   var td11 = document.getElementById("primerJJ"); //Puntajes
   var tblBody = document.createElement("tbody");
   for (var k = 0 ; k < numeroDeJueces; k++ )
    {
         var celdita = document.createElement("td");  var textoCelda = document.createTextNode(puntajes[k]); celdita.appendChild(textoCelda);  tblBody.appendChild(celdita); td11.appendChild(tblBody);
    }

  var td111 = document.getElementById("SC1"); //Valor de Subcuenta
    if ( numeroDeJueces<=6)
     {
      var vec1 = EliminarAltos(puntajes);
      var vec2 = EliminarBajos(vec1);
      var v = sumarVector(vec2);
      var celdita = document.createElement("td");  var textoCelda = document.createTextNode("Subcuenta = " + sumarVector(vec2)); celdita.appendChild(textoCelda);  tblBody.appendChild(celdita); td111.appendChild(tblBody);
     }
    if (numeroDeJueces>6)
     {
      var vec1 = EliminarAltos(puntajes);
      var vec2 = EliminarAltos(vec1);
      var vec3 = EliminarBajos(vec2);
      var vec4 = EliminarBajos(vec3);
      var v = sumarVector(vec4);
      var celdita = document.createElement("td");  var textoCelda = document.createTextNode("Subcuenta =" + sumarVector(vec4) ); celdita.appendChild(textoCelda);  tblBody.appendChild(celdita); td111.appendChild(tblBody);
     }

     var td1111 = document.getElementById("SC11"); //valor de Subcuenta porcentaje
      var celdita = document.createElement("td");  var textoCelda = document.createTextNode("Subcuenta " + w + "%" + " = " + (v*w/100)  ); celdita.appendChild(textoCelda);  tblBody.appendChild(celdita); td111.appendChild(tblBody);

  var td2 = document.getElementById("SegundoJ"); //Jueces de Comparaciones
   var tblBody = document.createElement("tbody");
   for (var k = 0 ; k < numeroDeJueces; k++ )
    {
         var celdita = document.createElement("td");  var textoCelda = document.createTextNode(jueces[k]); celdita.appendChild(textoCelda);  tblBody.appendChild(celdita); td2.appendChild(tblBody);
    }

    var td22 = document.getElementById("SegundoJJ");
     var tblBody = document.createElement("tbody");
     for (var k = 0 ; k < numeroDeJueces; k++ )
      {
           var celdita = document.createElement("td");  var textoCelda = document.createTextNode(puntajes2[k]); celdita.appendChild(textoCelda);  tblBody.appendChild(celdita); td22.appendChild(tblBody);
      }

      var td222 = document.getElementById("SC2"); //Valor de Subcuenta
        if ( numeroDeJueces2<=6)
         {
          var vec1 = EliminarAltos(puntajes2);
          var vec2 = EliminarBajos(vec1);
          var v = sumarVector(vec2);
          var celdita = document.createElement("td");  var textoCelda = document.createTextNode("Subcuenta = " + sumarVector(vec2)); celdita.appendChild(textoCelda);  tblBody.appendChild(celdita); td222.appendChild(tblBody);
         }
        if (numeroDeJueces2>6)
         {
          var vec1 = EliminarAltos(puntajes2);
          var vec2 = EliminarAltos(vec1);
          var vec3 = EliminarBajos(vec2);
          var vec4 = EliminarBajos(vec3);
          var v = sumarVector(vec4);
          var celdita = document.createElement("td");  var textoCelda = document.createTextNode("Subcuenta = " + sumarVector(vec4)); celdita.appendChild(textoCelda);  tblBody.appendChild(celdita); td222.appendChild(tblBody);
         }

         var td2222 = document.getElementById("SC22"); //valor de Subcuenta porcentaje
          var celdita = document.createElement("td");  var textoCelda = document.createTextNode("Subcuenta " + w2 + "%" + " = " + (v*w2/100)  ); celdita.appendChild(textoCelda);  tblBody.appendChild(celdita); td2222.appendChild(tblBody);



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
