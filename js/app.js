//cargamos la libreira de GOOGLE
google.load('visualization', '1', {'packages':['corechart']});

$(document).ready(function() {
    //Esta parte se activa cuando enviamos el formulario
    $('#form_encuesta').submit(function(event) {
        //verificamos si el usuario ya voto, si lo hiso mandamos mensage de error
        if(localStorage.voto){
            nota('error','Solo se puede votar una vez');
            return false;
        }
        //enviamos el formulario por AJAX al servidot
        $.get('servidor/servidor.php',$('#form_encuesta').serialize(), function(data) {
            //data es la respuesta del servidor, en formato JSON
            //si data.exto es verdadero entonces el servidor registro el voto y ahora guardamos en el 
            //localstorage que el usuario ya voto
            if(data.exito){
                nota('success',data.mensage);
                getDatos();
                localStorage.voto='true';
            }
            else{
                nota('error',data.mensage);
            }
        });
        return false;
    });
    //LLamamos a la funcion que carga los datos en la grafica
	getDatos();
});


//funcion para mostrar los usuarios registrados en la BD
function getDatos(){
	//Peticion AJAX al servidor para que nos devuelva los usuarios
	$.get('servidor/servidor.php',{getdatos:true}, function(data) {
        //el servidor devolvera un objeto JSON el cual contrenda los datos de los paises y edad
        pais = $.parseJSON(data.pais);
        edad = $.parseJSON(data.edad);

        //Configuramos nuestra primera grafica con los datos de los paises
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Pais');
        data.addColumn('number', 'No de Programadores');
        rows = [];
        for (var i = 0; i < pais.length; i++) {
            rows.push([pais[i].pais,parseInt(pais[i].votos)]);
        };
        data.addRows(rows);
        var options = {'title':'Programadores por país','width':400,'height':400};
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);

        //Configuramos nuestra segunda grafica con los datos de edad
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Edad');
        data.addColumn('number', 'No de Programadores');
        rows = [];
        for (var i = 0; i < edad.length; i++) {
            rows.push([edad[i].edad.toString(),parseInt(edad[i].votos)]);
        };
        data.addRows(rows);
        var options = {'title':'Edad de los programadores','width':400,'height':400};
        var chart = new google.visualization.BarChart(document.getElementById('chart_div2'));
        chart.draw(data, options);
	});
}

//funcion para enviar notificaciones al usuario la libreria la descargas de http://ned.im/noty/
function nota(op,msg,time){
    if(time == undefined)time = 5000;
    var n = noty({text:msg,maxVisible: 1,type:op,killer:true,timeout:time,layout: 'top'});
}