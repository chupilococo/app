angular.module('dvProds.controllers')
.controller('ProductosDetalleCtrl', [
	'$scope',
	'$stateParams',
	'Producto',
	function($scope, $stateParams, Producto) {
		$scope.producto = {
			id_producto: null,
			nombre: null,
			categoria: null,
			marca: null,
			precio: null,
			descripcion: null
		};

		// $http.get(API_SERVER + '/productos/' + $stateParams.id)
		Producto.uno($stateParams.id)
			.then(function(response) {
				$scope.producto = response.data;
			}); // papita :3
	}
]);