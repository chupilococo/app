<?php
namespace DaVinci\Auth;

// Agregamos la clase que nos sugiere el paquete de lcobucci.
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use DaVinci\Models\Usuario;

class Auth
{
	// En php 7.1+, las constantes pueden ser privadas, lo que sería más que recomendable
	// para éstas dos. No las pongo así por si tienen un php desatualizado en sus máquinas.
	const TOKEN_ISSUER = 'http://davinci.edu.ar';
	const SIGNER_KEY = 'ASJHjnfkjasdfhnkasjdkasDHSDAS';

	/**
	 * Loguea al usuario. Retorna false si falla.
	 *
	 * @param string $usuario
	 * @param string $password
	 * @return array|bool
	 */
	public function login($usuario, $password)
	{
		// Buscamos el usuario.
		$user = new Usuario;
		if($user->traerPorUsuario($usuario)) {
			// El usuario existe!
			// Verificamos el password.
			if(password_verify($password, $user->password)) {
				// El password coincide!
				// $this->loguearUsuario($user);
				$token = $this->generateToken($user);
				return [
					// Casteamos el token a string para que se imprima correctamente (requisito del paquete).
					'token' => (string) $token,
					'user' => [
						// TODO: No olvidar reemplazar por Getters.
						'id' => $user->id,
						'usuario' => $user->usuario,
					]
				];
			} else {
				// :(
				return false;
			}
		} else {
			// El usuario no existe... :(
			return false;
		}
	}

	/**
	 * Genera un token de autenticación.
	 *
	 * @param Usuario $user
	 * @return \Lcobucci\JWT\Token
	 */
	public function generateToken($user)
	{
		// Si el usuario es correcto, entonces lo tenemos que
		// autenticar!
		// Primero, creamos la instancia de Builder.
		$builder = new Builder();

		// Ahora, configuramos los "claims" que queremos que 
		// tenga el Builder.
		// Como "claims", vamos a setear 2:
		// "iss": Claim registrado del standard de JWT.
		//		Representa un texto que indique el emisor
		//		del token.
		// "id": Claim privado (inventado por nosotros) que
		//		contenga el id del usuario.
		$builder->setIssuer(self::TOKEN_ISSUER);
		// TODO: Reemplazar por Getter
		$builder->set('id', $user->id);

		// Instanciamos el algoritmo de encriptación.
		$signer = new Sha256();

		// Finalmente, firmamos el token con ese algoritmo.
		// Primero pasamos el signer, y después la "key"
		// secreta.
		$builder->sign($signer, self::SIGNER_KEY);

		// Obtenemos nuestro token! :D
		$token = $builder->getToken();

		return $token;
	}

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
		$valData->setIssuer(self::TOKEN_ISSUER);

		if(!$token->validate($valData)) {
			return false;
		}

		// Verificamos la firma.
		$signer = new Sha256;

		if(!$token->verify($signer, self::SIGNER_KEY)) {
			return false;
		}

		// Token válido! :D
		return [
			'id' => $token->getClaim('id')
		];
	}

	/********** Estos métodos no los usamos para la API **********/
	/** 
 	 * Marca como logueado al usuario en el sistema.
 	 *
 	 * @param Usuario $user
 	 */
	public function loguearUsuario(Usuario $user)
	{
		$_SESSION['id_user'] = $user->id;
		$_SESSION['usuario'] = $user->usuario;
	}

	/**
	 * Desloguea al usuario el sistema.
	 */
	public function logout()
	{
		unset($_SESSION['id_user']);
		unset($_SESSION['usuario']);
	}

	/**
	 * Retorna true si el usuario está logueado. False de lo 
	 * contrario.
	 *
	 * @return bool
	 */
	public static function isLogged()
	{
		if(isset($_SESSION['id_user'])) {
			return true;
		} else {
			return false;
		}

		// Más corto:
		// return isset($_SESSION['id_user']);
	}
}