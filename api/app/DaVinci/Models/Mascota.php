<?php

namespace DaVinci\Models;

use DaVinci\DB\DBConnection;
use JsonSerializable;

class Mascota implements JsonSerializable
{
	protected $id_mascota;
	protected $nombre;
    protected $imagen;
    protected $descripcion;
    
    /** @var array Listado de todas las propiedades de la clase, para la carga masiva de datos con Pelicula::cargarDatosDeArray */
    protected $propiedades = ['id_mascota', 'nombre','descripcion','imagen'];

    /**
     * @return array
     */
    public function jsonSerialize()
    {
        return [
            'id_mascota'    => $this->id_mascota,
            'nombre'        => $this->nombre,
            'descripcion'   => $this->descripcion,
            'imagen'        => $this->imagen,
        ];
    }
    
    /**
     * Obtiene todos los registros de la base de datos.
     *
     * @return array|Mascota[]
     */
    public function todos() 
	{
		$db = DBConnection::getConnection();
		$query = "SELECT * FROM mascotas m ORDER BY m.id_mascota";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $salida = [];
        while($fila = $stmt->fetch()) {
            $masc = new Mascota;
            $masc->cargarDatosDeArray($fila);
            $salida[] = $masc;
        }
        
        return $salida;
	}

    /**
     * Carga las propiedades del Mascota por su $id.
     *
     * @param int $id
     */
	public function traerPorId($id)
	{
		$db = DBConnection::getConnection();
        $query = 'SELECT * FROM mascotas m WHERE m.id_mascota = ?';
		$stmt = $db->prepare($query);
        $stmt->execute([$id]);
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
            if(isset($fila[$prop])) {
                $this->{$prop} = $fila[$prop];
            }
        }
    }

    /**
     * Inserta un nuevo Mascota en la base de datos.
     *
     * @param array $fila
     */
	public function crear($fila)
	{
		$db = DBConnection::getConnection();
        $query = "INSERT INTO mascotas (nombre, imagen, descripcion)
                VALUES (:nombre, :imagen, :descripcion)";
        $stmt = $db->prepare($query);
        $exito = $stmt->execute([
            'nombre'        => $fila['nombre'],
            'imagen'        => $fila['imagen'],
            'descripcion'   => $fila['descripcion'],
        ]);
        
        if($exito) {
            $fila['id_mascota'] = $db->lastInsertId();
            $this->cargarDatosDeArray($fila);
        } else {
            throw new Exception('Error al insertar el registro.');
        }
	}

	public function editar() 
	{
	    //TODO Agregar editar
//		$db = DBConnection::getConnection();
//		echo "Editando<br>";
	}

	public function eliminar() 
	{
//	    TODO agregar eliminar
//		echo "Eliminando<br>";
	}
}