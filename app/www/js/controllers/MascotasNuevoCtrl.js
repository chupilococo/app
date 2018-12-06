angular.module('dcPets.controllers')
.controller('MascotasNuevoCtrl', [
	'$scope',
	'$state',
	'$ionicPopup',
	'Mascota',
	'Auth',
	function($scope, $state, $ionicPopup, Mascota,Auth) {
		$scope.mascota = {
            id_mascota: null,
            nombre: null,
            descripcion: null,
            imagen:null,
            id_usuario:Auth.getId()
		};

		$scope.crear = function(mascota) {
		    console.log(mascota);
			 Mascota.crear(mascota)
				.then(function(response) {
					let responseInfo = response.data;
					if(responseInfo.status == 1) {
						$ionicPopup.alert({
							title: 'Éxito!',
							template: 'El mascota fue creado exitosamente! :D'
						}).then(function() {
							$state.go('tab.mascotas');
						});
					} else if(responseInfo.status == 0) {
						$ionicPopup.alert({
							title: 'Error',
							template: 'Oops! Hubo un error al grabar en nuestro servidor. Por favor, probá de nuevo.'
						});
					}
				});
		};

        $scope.imgPreview=function (input) {
            console.log(input);
            let reader  = new FileReader();
            reader.addEventListener("load", function () {
                $scope.mascota.imagen = reader.result;
                $scope.$apply();
            }, false);
            if (input) {
                reader.readAsDataURL(input.files[0]);
            }
        }
	}
]);
