<?php
namespace DaVinci\Controllers;

use DaVinci\Models\Mascota;
use DaVinci\Core\View;
use DaVinci\Core\Route;

class MascotasController
{
	public function todos()
	{
		$mascota = new Mascota;
		$mascotas = $mascota->todos();
		View::renderJson($mascotas);
	}

	public function detalle()
	{
		$params = Route::getUrlParameters();
		$id = $params['id'];

		$mascota = new Mascota;
		$mascota->traerPorId($id);

		View::renderJson($mascota);
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
//		$userId = $this->checkUserIsLogged();

		$input = file_get_contents('php://input');
		$postData = json_decode($input, true);

		// TODO: Validar :)

		try {
			$mascota = new Mascota;
			$mascota->crear([
				'nombre' 		=> $postData['nombre'],
				'precio' 		=> $postData['precio'],
				'id_marca' 		=> $postData['id_marca'],
				'id_categoria' 	=> $postData['id_categoria'],
				'descripcion' 	=> $postData['descripcion'],
			]);

			// Todo ok!
			View::renderJson([
				'status' => 1,
				'msg' => 'Mascota grabado exitosamente.',
				'data' => $postData
			]);
		} catch(\Exception $e) {
			// Todo mal :(
			View::renderJson([
				'status' => 0,
				'msg' => 'Oops! Ocurrió un problema al querer grabar los datos del nuevo mascota. Probá de nuevo más tarde o comunicate con nosotros :)'
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
			$mascota = new Mascota;
			$mascota->editar([
				'id_mascota' 	=> $id,
				'nombre' 		=> $putData['nombre'],
				'descripcion' 	=> $putData['descripcion'],
                'imagen'        => $putData['imagen'],
			]);

			// Todo ok!
			View::renderJson([
				'status' => 1,
				'msg' => 'Mascota editado exitosamente.',
				'data' => $mascota
			]);
		} catch(Exception $e) {
			// Todo mal :(
			View::renderJson([
				'status' => 0,
				'msg' => 'Oops! Ocurrió un problema al querer editar los datos del mascota. Probá de nuevo más tarde o comunicate con nosotros :)'
			]);
		}
	}

	public function eliminar()
	{
		$params = Route::getUrlParameters();
		$id = $params['id'];

		// TODO: Validar :)

		try {
			$mascota = new Mascota;
			$mascota->eliminar($id);

			// Todo ok!
			View::renderJson([
				'status' => 1,
				'msg' => 'Mascota eliminado exitosamente.',
				// 'data' => $mascota
			]);
		} catch(Exception $e) {
			// Todo mal :(
			View::renderJson([
				'status' => 0,
				'msg' => 'Oops! Ocurrió un problema al querer eliminar el mascota. Probá de nuevo más tarde o comunicate con nosotros :)'
			]);
		}
	}

	public function upvote (){
        $params = Route::getUrlParameters();
        $id = $params['id'];
        try {
            $mascota = new Mascota;
            $mascota->upvote($id);

            // Todo ok!
            View::renderJson([
                'status' => 1,
                'msg' => 'Mascota upvotedada.',
                'data' => $mascota
            ]);
        } catch(Exception $e) {
            // Todo mal :(
            View::renderJson([
                'status' => 0,
                'msg' => 'Oops! Ocurrió un problema :)'
            ]);
        }
    }
    public function downvote (){
        $params = Route::getUrlParameters();
        $id = $params['id'];
        try {
            $mascota = new Mascota;
            $mascota->downvote($id);

            // Todo ok!
            View::renderJson([
                'status' => 1,
                'msg' => 'Mascota upvotedada.',
                'data' => $mascota
            ]);
        } catch(Exception $e) {
            // Todo mal :(
            View::renderJson([
                'status' => 0,
                'msg' => 'Oops! Ocurrió un problema :)'
            ]);
        }
    }
}