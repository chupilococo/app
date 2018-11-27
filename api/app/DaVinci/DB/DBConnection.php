<?php
namespace DaVinci\DB;

use PDO;

/**
 * Esta clase permite manejar PDO en modo Singleton.
 */
class DBConnection
{
	// Las propiedades con static pasan a pertenecer a la _clase_, y no a los
	// _objetos_.
	private static $host = "52.26.64.212";
	private static $user = "wadmin";
	private static $pass = "bernardo05";
	private static $base = "IDM";
	private static $db;

	/** Constructor privado, para asegurarnos de que no instancien libremente esta clase. */
	private function __construct() {}

	/**
	 * Los métodos estáticos pueden llamarse _directamente_ desde la clase.
	 * Un detalle, los métodos estáticos no tienen acceso a $this.
	 */
	public static function getConnection()
	{
		if(is_null(self::$db)) {
			// "self" es una palabra reservada que reemplaza la clase en la que
			// estamos.
			$dsn = "mysql:host=" . self::$host . ":3308;dbname=" . self::$base . ";charset=utf8";

			// Con estos datos, nos conectamos! :D
			try {
//				echo "Abriendo la conexión! :D";
				self::$db = new PDO($dsn, self::$user, self::$pass);
			} catch(Exception $e) {
				die("Oops. Parece que hubo un error de conexión a la base. Ya hemos despachado a nuestra escuadra de monos ninja a arreglar el asunto. Probá de nuevo más tarde.");
			}
		}
		return self::$db;
	}
}