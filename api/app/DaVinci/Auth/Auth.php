<?php
namespace DaVinci\Auth;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use DaVinci\Models\Usuario;

class Auth
{
	// En php 7.1+, las constantes pueden ser privadas, lo que sería más que recomendable
	// para éstas dos. No las pongo así por si tienen un php desatualizado en sus máquinas.
	private const TOKEN_ISSUER = 'http://davinci.edu.ar';
	private const SIGNER_KEY = 'ASJHjnfkjasdfhnkasjdkasDHSDAS';

	/**
	 * Loguea al usuario. Retorna false si falla.
	 *
	 * @param string $usuario
	 * @param string $password
	 * @return array|bool
	 */
	public function login($usuario, $password)
	{
		$user = new Usuario;
        $user->traerPorUsuario($usuario);
		if(!is_null($user->id)) {
			if(password_verify($password, $user->password)) {
				$token = self::generateToken($user);
				return [
					'token' => (string) $token,
					'user' => [
						// TODO: No olvidar reemplazar por Getters.
						'id' => $user->id,
						'usuario' => $user->usuario,
					],
                    'status'=>1
				];
			} else {
				return false;
			}
		} else {
			// El usuario no existe... :(
			//return false;
            return "el usuario esta mal";
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
		$builder = new Builder();
		$builder->setIssuer(self::TOKEN_ISSUER);
		// TODO: Reemplazar por Getter
		$builder->set('id', $user->id);
		$signer = new Sha256();
		$builder->sign($signer, self::SIGNER_KEY);
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
		if($token == "null" || empty($token)) {
			return false;
		}
		$parser = new Parser;
		$token = $parser->parse((string) $token);
		$valData = new ValidationData;
		$valData->setIssuer(self::TOKEN_ISSUER);
		if(!$token->validate($valData)) {
			return false;
		}
		$signer = new Sha256;
		if(!$token->verify($signer, self::SIGNER_KEY)) {
			return false;
		}

		// Token válido! :D
		return [
			'id' => $token->getClaim('id')
		];
	}
}