// Primero, abrimos el módulo de servicios, y creamos el
// nuevo servicio.
angular.module('dvProds.services')
// .factory es el método para crear nuevos servicios.
.factory('Producto', [
	'$http',
	'API_SERVER',
	'Auth',
	function($http, API_SERVER, Auth) {
		/*function todos() {
			return $http.get(API_SERVER + '/productos');
		}

		function uno(id) {
			return $http.get(API_SERVER + '/productos/' + id);
		}

		function crear(datos) {
			return $http.post(API_SERVER + '/productos', datos);
		}

		// Los métodos que van a poder ser accedidos, los
		// debemos retornar como un objeto.
		return {
			todos: todos,
			uno: uno,
			crear: crear
		}*/

		// Los métodos que van a poder ser accedidos, los
		// debemos retornar como un objeto.
		return {
			todos: function() {
				// return $http.get(API_SERVER + '/productos');
				return $http.get(API_SERVER + '/productos.php');
			},
			uno: function(id) {
				// return $http.get(API_SERVER + '/productos/' + id);
				return $http.get(API_SERVER + '/productos-detalle.php?id=' + id);
			},
			crear: function(datos) {
				// return $http.post(API_SERVER + '/productos', datos);
				// El tercer parámetro (segundo en el caso de get y delete) es un
				// objeto de configuraciones.
				return $http.post(API_SERVER + '/productos-grabar.php', datos, {
					// "headers" permite definir encabezados para agregar a la
					// petición. El formato es la key del objeto es la key del
					// header, y el valor, el valor.
					headers: {
						// 'Content-Type': 'application/json'
						// Agregamos un header para enviar el token.
						// Nota: 'X-Token' es un nombre que inventamos nosotros.
						'X-Token': Auth.getToken()
					}
				});
			}
		};
	}
]);