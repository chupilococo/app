<?php
namespace DaVinci\Controllers;

use DaVinci\Models\Coment;
use DaVinci\Core\View;
use DaVinci\Core\Route;

class ComentsController
{
	public function getComents()
	{
        $params = Route::getUrlParameters();
        $id = $params['id'];
        $coment = new Coment;
		$coments = $coment->getCoements($id);
		View::renderJson($coments);
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
			$coment = new Coment;
			$coment->crear([
				'coment' 		=> $postData['coment'],
				'id_usuario' 	=> $postData['id_usuario'],
				'id_mascota' 	=> $postData['id_mascota'],
			]);

			View::renderJson([
				'status' => 1,
				'msg' => 'Comentario grabado exitosamente.',
				'data' => $postData
			]);
		} catch(\Exception $e) {

			View::renderJson([
				'status' => 0,
				'msg' => 'Oops! Ocurrió un problema al querer grabar los datos Comentario'
			]);
		}
	}
}