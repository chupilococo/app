<?php

namespace DaVinci\Models;

use DaVinci\DB\DBConnection;
use JsonSerializable;

class Mascota implements JsonSerializable
{
	// RECUERDEN que las PROPIEDADES NO DEBEN SER PÚBLICAS. Es solo para
	// ahorrar tiempo en clase.
	protected $id_mascota;
	protected $nombre;
	protected $id_categoria;
	protected $id_marca;
    protected $categoria;
    protected $marca;
	protected $precio;
	protected $descripcion;
    
    /** @var array Listado de todas las propiedades de la clase, para la carga masiva de datos con Pelicula::cargarDatosDeArray */
    protected $propiedades = ['id_mascota', 'nombre', 'precio', 'id_categoria', 'id_marca', 'categoria', 'marca', 'descripcion'];

    /**
     * @return array
     */
    public function jsonSerialize()
    {
        return [
            'id_mascota'   => $this->id_mascota,
            'nombre'        => $this->nombre,
            'precio'        => $this->precio,
            'id_marca'      => $this->id_marca,
            'id_categoria'  => $this->id_categoria,
            'descripcion'   => $this->descripcion,
            'marca'         => $this->marca,
            'categoria'     => $this->categoria,
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
		$query = "SELECT * FROM mascotas p
            INNER JOIN categorias c
                ON p.id_categoria = c.id_categoria
            INNER JOIN marcas m
                ON p.id_marca = m.id_marca
            ORDER BY p.id_mascota";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $salida = [];
        while($fila = $stmt->fetch()) {
            $prod = new Mascota;
            $prod->cargarDatosDeArray($fila);
            $salida[] = $prod;
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
        $query = 'SELECT * FROM mascotas p
            INNER JOIN categorias c
                ON p.id_categoria = c.id_categoria
            INNER JOIN marcas m
                ON p.id_marca = m.id_marca
            WHERE p.id_mascota = ?';
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
        // $this->propiedades = ['id_mascota', 'nombre', 'precio', 'id_categoria', 'id_marca', 'categoria', 'marca', 'descripcion']
        foreach($this->propiedades as $prop) {
            // Ej: $prop = "id_mascota"
            // Ej: $prop = "nombre"
            // Solo cargamos las propiedades que existen 
            // en el array que me pasan.
            if(isset($fila[$prop])) {
                // Ej: $this->id_mascota = $fila['id_mascota']
                // Ej: $this->nombre = $fila['nombre']
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
        $query = "INSERT INTO mascotas (nombre, precio, id_marca, id_categoria, descripcion)
                VALUES (:nombre, :precio, :id_marca, :id_categoria, :descripcion)";
        $stmt = $db->prepare($query);
        $exito = $stmt->execute([
            'nombre'        => $fila['nombre'],
            'precio'        => $fila['precio'],
            'id_marca'      => $fila['id_marca'],
            'id_categoria'  => $fila['id_categoria'],
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