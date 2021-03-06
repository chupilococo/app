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
    protected $score;

    /** @var array Listado de todas las propiedades de la clase, para la carga masiva de datos con Pelicula::cargarDatosDeArray */
    protected $propiedades = ['id_mascota', 'nombre','descripcion','imagen','score'];

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
            'score'        => $this->score,
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
     * Obtiene los registros de la base de datos filtrados por Owner
     * @return array|Mascota[]
     */
    public function getByOwner($id)
    {
        $db = DBConnection::getConnection();
        $query = "SELECT * FROM mascotas m
                  WHERE owner=?
                  ORDER BY m.id_mascota";
        $stmt = $db->prepare($query);
        $stmt->execute([$id]);
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
     * @param $id
     */
    public function upvote($id)
    {
        $db = DBConnection::getConnection();
        $query = 'UPDATE mascotas m SET SCORE=SCORE+1 WHERE m.id_mascota = ?';
        $stmt = $db->prepare($query);
        if($stmt->execute([$id])){
            $this->traerPorId($id);
        }
    }

    /**
     * @param $id
     */
    public function downvote($id)
    {
        $db = DBConnection::getConnection();
        $query = 'UPDATE mascotas m SET SCORE=SCORE-1 WHERE m.id_mascota = ?';
        $stmt = $db->prepare($query);
        if($stmt->execute([$id])){
            $this->traerPorId($id);
        }
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
     * @throws \Exception
     */
	public function crear($fila)
	{
		$db = DBConnection::getConnection();
        $query = "INSERT INTO mascotas (nombre, imagen, descripcion,owner)
                VALUES (:nombre, :imagen, :descripcion,:id_usuario)";
        $stmt = $db->prepare($query);
        $exito = $stmt->execute([
            'nombre'        => $fila['nombre'],
            'imagen'        => $fila['imagen'],
            'descripcion'   => $fila['descripcion'],
            'id_usuario'   => $fila['id_usuario'],
        ]);
        
        if($exito) {
            $fila['id_mascota'] = $db->lastInsertId();
            $this->cargarDatosDeArray($fila);
        } else {
            throw new \Exception('Error al insertar el registro.');
        }
	}

	public function editar($fila)
	{

	    print_r($fila);
        $db = DBConnection::getConnection();
        $query = "update mascotas
                    SET nombre=:nombre,
                        imagen=:imagen,
                        descripcion=:descripcion,
                        score=:score
                    where id_mascota=:id_mascota";
        $stmt = $db->prepare($query);
        $exito = $stmt->execute([
            'nombre'        => $fila['nombre'],
            'imagen'        => $fila['imagen'],
            'descripcion'   => $fila['descripcion'],
            'score'         => $fila['score'],
            'id_mascota'    => $fila['id_mascota'],
        ]);

        if ($exito){
            $this->cargarDatosDeArray($fila);
        }else{
            throw new \Exception('Error al actualizar el registro.');
        }

	}

	public function eliminar() 
	{
//	    TODO agregar eliminar
//		echo "Eliminando<br>";
	}
}