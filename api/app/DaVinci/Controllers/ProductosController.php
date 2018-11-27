<?php
namespace DaVinci\Controllers;

use DaVinci\Models\Producto;
use DaVinci\Core\View;
use DaVinci\Core\Route;

class ProductosController extends BaseController
{
	public function todos()
	{
		$producto = new Producto;
		$productos = $producto->todos();

		View::renderJson($productos);
	}

	public function detalle()
	{
		$params = Route::getUrlParameters();
		$id = $params['id'];

		$producto = new Producto;
		$producto->traerPorId($id);

		View::renderJson($producto);
	}

	public function crear()
	{
		// Y la verificación de si el usuario está autenticado para hacer esta
		// acción?
		/*$token = $_SERVER['HTTP_X_TOKEN'];

		if(!$tokenData = Auth::isTokenValid($token)) {
			View::renderJson([
				'status' => -1,
				'msg' => 'Se requiere estar autenticado para realizar esta acción.'
			]); // blah blah
			exit;
		} // EZ

		$userId = $tokenData['id'];*/
		$userId = $this->checkUserIsLogged();

		$input = file_get_contents('php://input');
		$postData = json_decode($input, true);

		// TODO: Validar :)

		try {
			$producto = new Producto;
			$producto->crear([
				'nombre' 		=> $postData['nombre'],
				'precio' 		=> $postData['precio'],
				'id_marca' 		=> $postData['id_marca'],
				'id_categoria' 	=> $postData['id_categoria'],
				'descripcion' 	=> $postData['descripcion'],
			]);

			// Todo ok!
			View::renderJson([
				'status' => 1,
				'msg' => 'Producto grabado exitosamente.',
				'data' => $postData
			]);
		} catch(Exception $e) {
			// Todo mal :(
			View::renderJson([
				'status' => 0,
				'msg' => 'Oops! Ocurrió un problema al querer grabar los datos del nuevo producto. Probá de nuevo más tarde o comunicate con nosotros :)'
			]);
		}
	}

	public function editar()
	{
		// Para el id...
		$params = Route::getUrlParameters();
		$id = $params['id'];
		// Para la info a editar...
		$input = file_get_contents('php://input');
		$putData = json_decode($input, true);

		// TODO: Validar :)

		try {
			$producto = new Producto;
			$producto->editar([
				'id_producto' 	=> $id,
				'nombre' 		=> $putData['nombre'],
				'precio' 		=> $putData['precio'],
				'id_marca' 		=> $putData['id_marca'],
				'id_categoria' 	=> $putData['id_categoria'],
				'descripcion' 	=> $putData['descripcion'],
			]);

			// Todo ok!
			View::renderJson([
				'status' => 1,
				'msg' => 'Producto editado exitosamente.',
				'data' => $producto
			]);
		} catch(Exception $e) {
			// Todo mal :(
			View::renderJson([
				'status' => 0,
				'msg' => 'Oops! Ocurrió un problema al querer editar los datos del producto. Probá de nuevo más tarde o comunicate con nosotros :)'
			]);
		}
	}

	public function eliminar()
	{
		$params = Route::getUrlParameters();
		$id = $params['id'];

		// TODO: Validar :)

		try {
			$producto = new Producto;
			$producto->eliminar($id);

			// Todo ok!
			View::renderJson([
				'status' => 1,
				'msg' => 'Producto eliminado exitosamente.',
				// 'data' => $producto
			]);
		} catch(Exception $e) {
			// Todo mal :(
			View::renderJson([
				'status' => 0,
				'msg' => 'Oops! Ocurrió un problema al querer eliminar el producto. Probá de nuevo más tarde o comunicate con nosotros :)'
			]);
		}
	}
}