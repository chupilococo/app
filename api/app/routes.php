<?php
/*
 * Este archivo va a contener TODAS las rutas de
 * nuestra aplicación.
 *
 * Para esto, vamos a crear una clase Route cuya
 * función sea la de registrar y administrar las rutas.
 */
use DaVinci\Core\Route;

Route::add('GET', '/perfil', 'UsuarioController@perfil');
Route::add('POST', '/login', 'AuthController@login');
Route::add('GET', '/mascotas', 'MascotasController@todos');
Route::add('GET', '/mascotas/{id}', 'MascotasController@detalle');

Route::add('POST', '/mascotas', 'MascotasController@crear');
Route::add('PUT', '/mascotas/upvote/{id}', 'MascotasController@upvote');
Route::add('PUT', '/mascotas/downvote/{id}', 'MascotasController@downvote');
Route::add('PUT', '/mascotas/{id}', 'MascotasController@editar');
Route::add('GET', '/mascotas/perfil/{id}', 'MascotasController@getByPerfil');
Route::add('DELETE', '/mascotas/{id}', 'MascotasController@eliminar');