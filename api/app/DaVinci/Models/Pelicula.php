<?php

namespace DaVinci\Models;

use DaVinci\DB\DBConnection;

class Pelicula
{
	// RECUERDEN que las PROPIEDADES NO DEBEN SER PÚBLICAS. Es solo para
	// ahorrar tiempo en clase.
	public $id_pelicula;
	public $nombre;
	public $genero;
	public $precio;
	public $fecha;
	public $descripcion;
    
    /** @var array Listado de todas las propiedades de la clase, para la carga masiva de datos con Pelicula::cargarDatosDeArray */
    protected $propiedades = ['id_pelicula', 'nombre', 'genero', 'precio', 'fecha', 'descripcion'];
    
    /**
     * Obtiene todas las Películas de la base de datos.
     *
     * @return array|Pelicula[]
     */
    public function todas() 
	{
		$db = DBConnection::getConnection();
		$query = "SELECT * FROM peliculas";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $salida = [];
        while($fila = $stmt->fetch()) {
            $pel = new Pelicula;
            $pel->cargarDatosDeArray($fila);
            $salida[] = $pel;
        }
        
        return $salida;
	}

    /**
     * Carga las propiedades de la Película por su $id.
     *
     * @param int $id
     */
	public function traerPorId($id)
	{
		$db = DBConnection::getConnection();
        $query = 'SELECT * FROM peliculas
                WHERE id_pelicula = ?';
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
            $this->{$prop} = $fila[$prop];
        }
    }

    /**
     * Inserta una nueva Película en la base de datos.
     *
     * @param array $fila
     */
	public function crear($fila)
	{
		$db = DBConnection::getConnection();
        $query = "INSERT INTO peliculas (nombre, genero, precio, fecha, descripcion)
                VALUES (:nombre, :genero, :precio, :fecha, :descripcion)";
        $stmt = $db->prepare($query);
        $exito = $stmt->execute([
            'nombre'        => $fila['nombre'],
            'genero'        => $fila['genero'],
            'precio'        => $fila['precio'],
            'fecha'         => $fila['fecha'],
            'descripcion'   => $fila['descripcion'],
        ]);
        
        if($exito) {
            $fila['id_pelicula'] = $db->lastInsertId();
            $this->cargarDatosDeArray($fila);
        } else {
            throw new Exception('Error al insertar el registro.');
        }
	}

	public function editar() 
	{
		$db = DBConnection::getConnection();
		echo "Editando<br>";
	}

	public function eliminar() 
	{
		echo "Eliminando<br>";
	}
}