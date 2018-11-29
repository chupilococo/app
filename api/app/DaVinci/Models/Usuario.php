<?php

namespace DaVinci\Models;

use DaVinci\DB\DBConnection;

class Usuario
{
	// RECUERDEN que las PROPIEDADES NO DEBEN SER PÚBLICAS. Es solo para
	// ahorrar tiempo en clase.
	public $id;
	public $nombre;
	public $usuario;
	public $password;
	public $mail;

    /** @var array Listado de todas las propiedades de la clase, para la carga masiva de datos con Pelicula::cargarDatosDeArray */
    protected $propiedades = ['id', 'usuario', 'nombre', 'mail', 'password'];

    /**
     * Carga las propiedades del usuario por su $id.
     *
     * @param int $usuario
     */
	public function traerPorUsuario($usuario)
	{
		$db = DBConnection::getConnection();
        $query = 'SELECT * FROM usuarios
                WHERE usuario = ?';
		$stmt = $db->prepare($query);
        $stmt->execute([$usuario]);
        $fila = $stmt->fetch();
        $this->cargarDatosDeArray($fila);
	}
    
    /**
     * Carga los datos de la $fila en las propiedades.
     *
     * @param array $fila
     */
    public function cargarDatosDeArray($fila)
    {
        foreach($this->propiedades as $prop) {
            $this->{$prop} = $fila[$prop];
        }
    }
}