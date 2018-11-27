<?php
/*
 * Este archivo va a contener TODAS las rutas de
 * nuestra aplicación.
 *
 * Para esto, vamos a crear una clase Route cuya
 * función sea la de registrar y administrar las rutas.
 */
use DaVinci\Core\Route;

Route::add('GET', '/productos', 'ProductosController@todos');
Route::add('GET', '/productos/{id}', 'ProductosController@detalle');

Route::add('POST', '/productos', 'ProductosController@crear');
Route::add('PUT', '/productos/{id}', 'ProductosController@editar');
Route::add('DELETE', '/productos/{id}', 'ProductosController@eliminar');