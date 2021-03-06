angular.module('dcPets.controllers')
.controller('PerfilCtrl', [
    '$scope',
	'$ionicPopup',
	'$state',
	'Auth',
	'Mascota',
	function($scope, $ionicPopup, $state, Auth,Mascota) {
        $scope.goTo=function (state,params) {
            $state.go(state,params);
        };
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
        $scope.delete=function (id) {
			$ionicPopup.alert(
				{
					title:'se borro la mascota nro'+id
				}
			);
        };
        $scope.edit=function (id) {
			$ionicPopup.alert(
				{
					title:'se editara '+id
				}
			).then(
			    function () {
                    $state.go('tab.mascotas-edit',{'id':id});
                }
            );
        };
	}
]);