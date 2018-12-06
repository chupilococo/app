angular.module('dcPets.controllers')
.controller('MascotasDetalleCtrl', [
	'$scope',
	'$stateParams',
	'Mascota',
  'Coments',
	'Auth',
	'NO_IMG',
	function($scope, $stateParams, Mascota,Coments,Auth,NO_IMG) {
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
    $scope.coments=[];
    Coments.getComents($stateParams.id).then(
      function(response){
        $scope.coments=response.data;
        console.log($scope.coments);
      }
    );
    $scope.comentario={
      coment:null,
      id_usuario:null,
      id_mascota: null
    };
    $scope.crearComent=function (comentario) {
      comentario.id_mascota=$scope.mascota.id_mascota;
      if(Auth.isLogged()){
        comentario.id_usuario=Auth.getId();
      }
      Coments.crearComent(comentario);
    }
	}
]);
