<?php
//Le decimos a PHP que vamos a devolver objetos JSON
header('Content-type: application/json');
//Importamos la libreria de ActiveRecord
require_once 'php-activerecord/ActiveRecord.php';
//Configuracion de ActiveRecord
ActiveRecord\Config::initialize(function($cfg)
{
	//Ruta de una carpeta que contiene los modelos de la BD (tablas)
	$cfg->set_model_directory('models');
	//Creamos la conexion
	$cfg->set_connections(array(
		'development' => 'mysql://USUARIO:PASS@HOST/NOMBRE_BD'));
});

//Verificamos la peticion del usuario, para ver si queire votar o ver los votos
//Esta parte agrega un nuevo voto a la BD
if(isset($_GET['nuevo']) && isset($_GET['pais']) && isset($_GET['edad'])){
	unset($_GET['nuevo']);
	try{
		$encuesta = Encuesta::create($_GET);
		$respuesta['exito'] = true;
		$respuesta['mensage'] = 'Voto Registrado Correctamente';
		echo json_encode($respuesta);
		return;
	}catch(Exception $e){
		$respuesta['exito'] = false;
		$respuesta['mensage'] = 'Error al registrar tu voto.';
		echo json_encode($respuesta);
		return;
	}
}

//Esta parte regresa los votos guardados en la BD
if(isset($_GET['getdatos'])){
		//Buscamos todos los registros de la tabla encuesta
		//La funcion find_by_sql nos permite realizar consultas directamente con codigo SQL
		$paises = Encuesta::find_by_sql('SELECT p.pais, count(p.id) AS votos FROM encuesta p GROUP by p.pais');
		$edades = Encuesta::find_by_sql('SELECT p.edad, count(p.id) AS votos FROM encuesta p GROUP by p.edad');
		//convertimos los registros a JSON y los enviamos la respuesta
		$respuesta['pais'] = datosJSON($paises);
		$respuesta['edad'] = datosJSON($edades);
		echo json_encode($respuesta);
		return;
}else{
	//respuesta para una operacion desconocida
	$respuesta['exito'] = false;
	$respuesta['mensage'] = 'Operación desconocida';
	echo json_encode($respuesta);
	return;
}

//funcion que convierte objetos regresados por la BD a JSON
function datosJSON($data, $options = null) {
	$out = "[";
	foreach( $data as $row) { 
		if ($options != null)
			$out .= $row->to_json($options);
		else 
			$out .= $row->to_json();
		$out .= ",";
	}
	$out = rtrim($out, ',');
	$out .= "]";
	return $out;
}
?>