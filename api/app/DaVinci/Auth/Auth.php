<?php
namespace DaVinci\Auth\Auth;

// Agregamos la clase que nos sugiere el paquete de lcobucci.
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Signer\Hmac\Sha256;

class Auth
{
	/**
	 * Retorna un array con los datos del token si es válido.
	 * false de lo contrario.
	 *
	 * @param string $token
	 * @return array|boolean
	 */
	public function isTokenValid($token)
	{
		// Verificar que el token no esté vacío.
		if($token == "null" || empty($token)) {
			return false;
		}

		// Verificar que el token sea válido.
		// Instanciamos el parser para transformar el token de string a un objeto.
		$parser = new Parser;

		// Parseamos el token.
		$token = $parser->parse((string) $token);

		// Ya con el token, podemos validarlo. Para eso, vamos a verificar 2 cosas:
		// 1. Que el "issuer" (emisor) sea 'http://davinci.edu.ar' (el que usamos para
		//		generarlo).
		// 2. Que la firma sea "auténtica" (según lo que generamos en el login).
		// Verificamos el issuer.
		$valData = new ValidationData;
		$valData->setIssuer('http://davinci.edu.ar');

		if(!$token->validate($valData)) {
			return false;
		}

		// Verificamos la firma.
		$signer = new Sha256;

		if(!$token->verify($signer, 'ASJHjnfkjasdfhnkasjdkasDHSDAS')) {
			return false;
		}

		// Token válido! :D
		return [
			'id' => $token->getClaim('id')
		];
	}
}