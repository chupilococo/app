// Primero, abrimos el módulo de servicios, y creamos el
// nuevo servicio.
angular.module('dcPets.services')
// .factory es el método para crear nuevos servicios.
.factory('Producto', [
	'$http',
	'API_SERVER',
	'Auth',
	function($http, API_SERVER, Auth) {

		return {
			todos: function() {
				return $http.get(API_SERVER + '/productos');
			},
			uno: function(id) {
				return $http.get(API_SERVER + '/productos/' + id);
			},
			crear: function(datos) {
				return $http.post(API_SERVER + '/productos-grabar.php', datos, {
					headers: {
						'X-Token': Auth.getToken()
					}
				});
			}
		};
	}
]);