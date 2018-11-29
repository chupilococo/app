<?php
namespace DaVinci\DB;

use PDO;

/**
 * Esta clase permite manejar PDO en modo Singleton.
 */
class DBConnection
{
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
			//$dsn = "mysql:host=" . self::$host . ":3308;dbname=" . self::$base . ";charset=utf8"; //DaVinci
			$dsn = "mysql:host=" . self::$host . ":3306;dbname=" . self::$base . ";charset=utf8"; //resto del mundo

			try {
				self::$db = new PDO($dsn, self::$user, self::$pass);
			} catch(Exception $e) {
				die("Oops. Parece que hubo un error de conexión a la base. Ya hemos despachado a nuestra escuadra de monos ninja a arreglar el asunto. Probá de nuevo más tarde.");
			}
		}
		return self::$db;
	}
}