angular.module('dcPets.controllers').controller('MascotasEditarCtrl', [
	'$scope','$stateParams','Mascota','Auth','NO_IMG','$state',
	function($scope,$stateParams,Mascota,Auth,NO_IMG,$state) {
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
					$scope.mascota.imagen=response.data.imagen;
				}
			});
		$scope.update=function(mascota){
			Mascota.update(mascota)
                .then(function () {
				$ionicPopup.alert({
					title:'Mascota Editada exitosamente'
				}).then(function () {
					$state.go('tab.perfil');
				})
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
