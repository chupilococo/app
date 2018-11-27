<?php
// Incluimos el autoload de vendor para poder usar la
// clase para generar el Token de JWT.
require 'vendor/autoload.php';

// Agregamos el "use" que nos pide el paquete de JWT.
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha256;

header('Content-Type: application/json; charset=utf-8');

$db = mysqli_connect('52.26.64.212', 'wadmin', 'bernardo05', 'IDM');

mysqli_set_charset($db, 'utf8');

// Capturamos los datos que vienen por POST.
$input = file_get_contents('php://input');
$datosPost = json_decode($input, true);

// TODO: Validar ;) ;) ;)

$query = "SELECT * FROM usuarios
		WHERE usuario = '" . mysqli_real_escape_string($db, $datosPost['usuario']) . "'
		AND password = '" . mysqli_real_escape_string($db, $datosPost['password']) . "'";

$res = mysqli_query($db, $query);

// Verificamos si el usuario existe o no.
if($fila = mysqli_fetch_assoc($res)) {
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
	$builder->setIssuer('http://davinci.edu.ar');
	$builder->set('id', $fila['id']);

	// Instanciamos el algoritmo de encriptación.
	$signer = new Sha256();

	// Finalmente, firmamos el token con ese algoritmo.
	// Primero pasamos el signer, y después la "key"
	// secreta.
	$builder->sign($signer, 'ASJHjnfkjasdfhnkasjdkasDHSDAS');

	// Obtenemos nuestro token! :D
	$token = $builder->getToken();

	// Mandamos la salida al cliente.
	echo json_encode([
		'status' => 1,
		'data' => [
			// El paquete, para transformar el token a
			// texto, requiere que se lo utilice en un
			// contexto de string. Para forzar a que se
			// lea como texto, le concatenamos un string
			// vacío al comienzo.
			'token' 	=> "" . $token,
			'id' 		=> $fila['id'],
			'usuario' 	=> $fila['usuario'],
		]
	]);
} else {
	echo json_encode([
		'status' => 0,
		'msg' => 'Las credenciales ingresadas no coinciden con ningún registro. Verficá los datos nuevamente y volvé a intentar.'
	]);
}