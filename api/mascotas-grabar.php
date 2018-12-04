<?php
// Agregamos la clase que nos sugiere el paquete de lcobucci.
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Signer\Hmac\Sha256;

// Agregamos el autoload de Composer, si necesitamos
// usar el paquete de JWT.
require __DIR__ . '/../vendor/autoload.php';

// Validación del Token.
// Paso 1: Obtener el token.
// El token viene en un header. Y cómo leemos los headers en php?
// La forma más simple, es leerlos desde la súperglobal $_SERVER.
// Entre otras cosas, $_SERVER tiene todos los headers que recibe, con el
// siguiente formato:
// - Todo en mayúsculas
// - Los guiones medios se transforman a bajos.
// - Empiezan con "HTTP_".
// Por ejemplo, si el header se llama "X-Token", en $_SERVER se llama
// "HTTP_X_TOKEN".
$token = $_SERVER['HTTP_X_TOKEN'];

// Paso 2: Verificar que haya llegado un token.
if($token == "null" || empty($token)) {
	echo json_encode([
		'status' => -1,
		'msg' => 'Se requiere estar autenticado para realizar esta acción.'
	]);
	exit;
}

// Paso 3: Verificar que el token sea válido.
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
	echo json_encode([
		'status' => -1,
		'msg' => 'El token contiene información incorrecta.'
	]);
	exit;
}

// Verificamos la firma.
$signer = new Sha256;

if(!$token->verify($signer, 'ASJHjnfkjasdfhnkasjdkasDHSDAS')) {
	echo json_encode([
		'status' => -1,
		'msg' => 'La firma del token no es correcta.'
	]);
	exit;
}

// Mostramos el id del usuario obtenido en el token.
//echo "El id del usuario es: " . $token->getClaim('id');
//exit;


header("Content-Type: application/json; charset=utf-8");

$db = mysqli_connect('52.26.64.212', 'wadmin', 'bernardo05', 'IDM');

mysqli_set_charset($db, 'utf8');

$input = file_get_contents('php://input');
$postData = json_decode($input, true);

$nombre 		= mysqli_real_escape_string($db, $postData['nombre']);
$precio 		= mysqli_real_escape_string($db, $postData['precio']);
$id_marca 		= mysqli_real_escape_string($db, $postData['id_marca']);
$id_categoria 	= mysqli_real_escape_string($db, $postData['id_categoria']);
$descripcion 	= mysqli_real_escape_string($db, $postData['descripcion']); // :)

// TODO: Validar ;)

$query = "INSERT INTO mascotas (nombre, precio, id_marca, id_categoria, descripcion)
		VALUES ('$nombre', '$precio', '$id_marca', '$id_categoria', '$descripcion')";

$exito = mysqli_query($db, $query);

if($exito) {
	$postData['id_mascota'] = mysqli_insert_id($db);
	echo json_encode([
		'status' => 1,
		'msg' => 'Mascota grabado exitosamente.',
		'data' => $postData
	]);
} else {
	echo json_encode([
		'status' => 0,
		// 'msg' => 'Error al grabar el mascota en la base de datos.'
		'msg' => 'Oops! Ocurrió un problema al querer grabar los datos del nuevo mascota. Probá de nuevo más tarde o comunicate con nosotros :)'
	]);
}