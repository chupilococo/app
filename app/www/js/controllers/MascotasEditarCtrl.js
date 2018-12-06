angular.module('dcPets.controllers').controller('MascotasEditarCtrl', [
	'$scope','$stateParams','Mascota','Auth','NO_IMG',
	function($scope,$stateParams,Mascota,Auth,NO_IMG) {
		$scope.mascota = {
			id_mascota: null,
			nombre: null,
			descripcion: null,
			imagen:null
		};
		Mascota.uno($stateParams.id)
			.then(function(response) {
				$scope.mascota = response.data;
				if(response.data.imagen===''){
					$scope.mascota.imagen=NO_IMG;
				}else{
					$scope.mascota.imagen='data:image/png;base64,'+response.data.imagen;
				}
			});
		}
]);
