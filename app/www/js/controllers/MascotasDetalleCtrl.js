angular.module('dcPets.controllers')
.controller('MascotasDetalleCtrl', [
	'$scope',
	'$stateParams',
	'Mascota',
	function($scope, $stateParams, Mascota) {
		$scope.mascota = {
			id_mascota: null,
			nombre: null,
			categoria: null,
			marca: null,
			precio: null,
			descripcion: null
		};

		Mascota.uno($stateParams.id)
			.then(function(response) {
				$scope.mascota = response.data;
			});
	}
]);