<?php

namespace DaVinci\Models;

use DaVinci\DB\DBConnection;
use JsonSerializable;

class Coment implements JsonSerializable
{
	protected $id;
	protected $coment;
    protected $usuario;
    protected $dateTime;
    protected $propiedades = ['id','coment','dateTime','usuario'];

    /**
     * @return array
     */
    public function jsonSerialize()
    {
        return [
            'id'        => $this->id,
            'coment'    => $this->coment,
            'usuario'   => $this->usuario,
            'dateTime'  => $this->dateTime,
        ];
    }
    
    /**
     * Obtiene todos los registros de la base de datos.
     *
     * @return array|Mascota[]
     */
    public function getCoements($id)
	{
		$db = DBConnection::getConnection();
		$query = "
            SELECT c.id, c.coment, c.dateTime, IFNULL(u.usuario, 'Anónimo') as usuario FROM 
                  coments c LEFT JOIN usuarios u
                    ON c.id_usuario=u.id
            where id_mascota= ? ORDER by c.dateTime DESC
        ";
        $stmt = $db->prepare($query);
        $stmt->execute([$id]);
        $salida = [];
        while($fila = $stmt->fetch()) {
            $com = new Coment;
            $com->cargarDatosDeArray($fila);
            $salida[] = $com;
        }
        
        return $salida;
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
     * Inserta un nuevo Cometario en la base de datos.
     *
     * @param array $fila
     * @throws \Exception
     */
	public function crear($fila)
	{
		$db = DBConnection::getConnection();
        $query = "INSERT INTO IDM.coments (coment,id_mascota,id_usuario)
                  VALUES(:coment, :id_mascota, :id_usuario);";
        $stmt = $db->prepare($query);
        $exito = $stmt->execute([
            'coment'     => $fila['coment'],
            'id_mascota' => $fila['id_mascota'],
            'id_usuario' => $fila['id_usuario'],
        ]);
        
        if($exito) {
            $fila['id'] = $db->lastInsertId();
            $this->cargarDatosDeArray($fila);
        } else {
            throw new \Exception('Error al insertar el registro.');
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