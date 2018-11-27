// Agregamos un nuevo controller al módulo de controllers que ionic
// definió ('dcPets.controllers').
angular.module('dcPets.controllers')
.controller('ProductosCtrl', [
	'$scope',
	// 'Producto' sale del servicio "Producto.js".
	'Producto',
	function($scope, Producto) {
		// $scope es el servicio que sirve para vincular los datos y
		// funciones que queremos que estén disponibles en la vista.
		$scope.productos = [];

		// Justo de antes de entrar a la vista, le pedimos
		// que traiga los productos.
		$scope.$on('$ionicView.beforeEnter', function() {
	        Producto.todos()
			.then(function(response) {
				// Resolve
				console.log(response);
				$scope.productos = response.data;
			}, function() {
				// Reject
				alert("TODO MAL AAAHHHHHH");
			});
	    });		
	}
]);