<?php
header("Content-Type: application/json; charset=utf-8");

$db = mysqli_connect('52.26.64.212', 'wadmin', 'bernardo05', 'IDM');

mysqli_set_charset($db, 'utf8');

$query = "SELECT * FROM productos p
			INNER JOIN categorias c
				ON p.id_categoria = c.id_categoria
			INNER JOIN marcas m
				ON p.id_marca = m.id_marca
			ORDER BY p.id_producto";

$res = mysqli_query($db, $query);

$salida = [];

while($fila = mysqli_fetch_assoc($res)) {
	$salida[] = $fila;
}

echo json_encode($salida);
