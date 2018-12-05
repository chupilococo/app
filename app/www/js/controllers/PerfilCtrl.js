angular.module('dcPets.controllers')
.controller('PerfilCtrl', [
    '$scope',
	'$ionicPopup',
	'$state',
	'Auth',
	'Mascota',
	function($scope, $ionicPopup, $state, Auth,Mascota) {
        $scope.mascotas = [];
        $scope.$on('$ionicView.beforeEnter', function() {
            Mascota.getByPerfil(Auth.getId())
                .then(function(response) {
                    $scope.mascotas = response.data;
                    console.log($scope.mascotas);
                }, function() {
                    $ionicPopup.alert({
                        title: 'Upss',
                        template: 'Puede que haya habido un error \n' +
                            'proba de nuevo, en un rato...'
                    });
                });
        });
        $scope.delete=function () {
			$ionicPopup.alert(
				{
					title:'se borro'
				}
			);
        };
        $scope.edit=function () {
			$ionicPopup.alert(
				{
					title:'se editara'
				}
			);
        };
	}
]);