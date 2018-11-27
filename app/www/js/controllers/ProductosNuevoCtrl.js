angular.module('dvProds.controllers')
.controller('ProductosNuevoCtrl', [
	'$scope',
	'$state',
	'$ionicPopup',
	'Producto',
	function($scope, $state, $ionicPopup, Producto) {
		$scope.producto = {
			nombre		: null,
			id_categoria: null,
			id_marca	: null,
			precio		: null,
			descripcion	: null
		};

		$scope.grabar = function(producto) {
			// $http.post(API_SERVER + '/productos', producto)
			Producto.crear(producto)
				.then(function(response) {
					let responseInfo = response.data;
					if(responseInfo.status == 1) {
						$ionicPopup.alert({
							title: 'Éxito!',
							template: 'El producto fue creado exitosamente! :D'
						}).then(function() {
							// Lo redireccionamos al listado, pero luego de que cierren el mensaje.
							$state.go('tab.productos');
						});
					} else if(responseInfo.status == 0) {
						$ionicPopup.alert({
							title: 'Error',
							template: 'Oops! Hubo un error al grabar en nuestro servidor. Por favor, probá de nuevo.'
						});
					}
				});
		}; // EZ PZ - Se pronuncia: "Easy peasy".
	}
]);