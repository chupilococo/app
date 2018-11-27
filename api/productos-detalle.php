<?php
header("Content-Type: application/json; charset=utf-8");

$db = mysqli_connect('52.26.64.212', 'wadmin', 'bernardo05', 'IDM');

mysqli_set_charset($db, 'utf8');

$id = mysqli_real_escape_string($db, $_GET['id']);

$query = "SELECT * FROM productos p
			INNER JOIN categorias c
				ON p.id_categoria = c.id_categoria
			INNER JOIN marcas m
				ON p.id_marca = m.id_marca
			WHERE p.id_producto = '$id'
			ORDER BY p.id_producto";

$res = mysqli_query($db, $query);

$fila = mysqli_fetch_assoc($res);

echo json_encode($fila);