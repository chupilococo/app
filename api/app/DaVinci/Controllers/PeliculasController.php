<?php
namespace DaVinci\Controllers;

use DaVinci\Core\App;
use DaVinci\Core\Route;
use DaVinci\Core\View;
use DaVinci\Models\Pelicula;

class PeliculasController
{
	public function listar()
	{
		$peli = new Pelicula;
		$peliculas = $peli->todas();
		
		/*View::render('peliculas/index', [
			// La key va a ser el nombre de la variable que recibe la vista.
			'peliculas' => $peliculas
		]);*/

		// Verificamos si existe la variable de sesión 
		// con un mensaje.
		if(isset($_SESSION['mensaje'])) {
			$mensaje = $_SESSION['mensaje'];
			unset($_SESSION['mensaje']);
		}
		
		// Alternativa más cortita para pasar los datos.
		View::render('peliculas/index', compact('peliculas', 'mensaje'));
	}

	public function detalle()
	{
		$data = Route::getUrlParameters();
		// print_r($data);
		$id = $data['id'];
		$pelicula = new Pelicula;
		$pelicula->traerPorId($id);

		View::render('peliculas/detalle', compact('pelicula'));
		// View::renderJson($pelicula);
		/*View::render('peliculas/detalle', [
			'pelicula' => $pelicula
		]);*/
	}
/*
	public function formNueva()
	{
		View::render('peliculas/form-nueva');
	}
*/
	public function grabar()
	{
		// TODO: Validar :)

		$peli = new Pelicula;
		$peli->crear([
			'nombre' 		=> $_POST['nombre'],
			'genero' 		=> $_POST['genero'],
			'precio' 		=> $_POST['precio'],
			'fecha' 		=> $_POST['fecha'],
			'descripcion' 	=> $_POST['descripcion'],
		]);

		$_SESSION['mensaje'] = "La película se creó exitosamente! :D";

		App::redirect('peliculas');
	}
}