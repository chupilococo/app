<?php

namespace DaVinci\Models;

use DaVinci\DB\DBConnection;
use JsonSerializable;

class Producto implements JsonSerializable
{
	// RECUERDEN que las PROPIEDADES NO DEBEN SER PÚBLICAS. Es solo para
	// ahorrar tiempo en clase.
	protected $id_producto;
	protected $nombre;
	protected $id_categoria;
	protected $id_marca;
    protected $categoria;
    protected $marca;
	protected $precio;
	protected $descripcion;
    
    /** @var array Listado de todas las propiedades de la clase, para la carga masiva de datos con Pelicula::cargarDatosDeArray */
    protected $propiedades = ['id_producto', 'nombre', 'precio', 'id_categoria', 'id_marca', 'categoria', 'marca', 'descripcion'];

    /**
     * @return array
     */
    public function jsonSerialize()
    {
        return [
            'id_producto'   => $this->id_producto,
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
     * @return array|Producto[]
     */
    public function todos() 
	{
		$db = DBConnection::getConnection();
		$query = "SELECT * FROM productos p
            INNER JOIN categorias c
                ON p.id_categoria = c.id_categoria
            INNER JOIN marcas m
                ON p.id_marca = m.id_marca
            ORDER BY p.id_producto";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $salida = [];
        while($fila = $stmt->fetch()) {
            $prod = new Producto;
            $prod->cargarDatosDeArray($fila);
            $salida[] = $prod;
        }
        
        return $salida;
	}

    /**
     * Carga las propiedades del Producto por su $id.
     *
     * @param int $id
     */
	public function traerPorId($id)
	{
		$db = DBConnection::getConnection();
        $query = 'SELECT * FROM productos p
            INNER JOIN categorias c
                ON p.id_categoria = c.id_categoria
            INNER JOIN marcas m
                ON p.id_marca = m.id_marca
            WHERE p.id_producto = ?';
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
        // $this->propiedades = ['id_producto', 'nombre', 'precio', 'id_categoria', 'id_marca', 'categoria', 'marca', 'descripcion']
        foreach($this->propiedades as $prop) {
            // Ej: $prop = "id_producto"
            // Ej: $prop = "nombre"
            // Solo cargamos las propiedades que existen 
            // en el array que me pasan.
            if(isset($fila[$prop])) {
                // Ej: $this->id_producto = $fila['id_producto']
                // Ej: $this->nombre = $fila['nombre']
                $this->{$prop} = $fila[$prop];
            }
        }
    }

    /**
     * Inserta un nuevo Producto en la base de datos.
     *
     * @param array $fila
     */
	public function crear($fila)
	{
		$db = DBConnection::getConnection();
        $query = "INSERT INTO productos (nombre, precio, id_marca, id_categoria, descripcion)
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
            $fila['id_producto'] = $db->lastInsertId();
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