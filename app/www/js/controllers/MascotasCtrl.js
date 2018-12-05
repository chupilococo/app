angular.module('dcPets.controllers')
.controller('MascotasCtrl', [
	'$scope',
	'$ionicPopup',
	'Mascota',
	function($scope,$ionicPopup,Mascota) {
		$scope.mascotas = [];
		$scope.$on('$ionicView.beforeEnter', function() {
	        Mascota.todos()
			.then(function(response) {
				$scope.mascotas = response.data;
			}, function() {
                $ionicPopup.alert({
                    title: 'Upss',
                    template: 'Puede que haya habido un error \n' +
						'proba de nuevo, en un rato...'
                });
			});
	    });
        $scope.upvote=function(id){
            console.log('se voto por la mascota '+id);
        };
        $scope.downvote=function(id){
            console.log('se desvoto por la mascota '+id);
        };
	}
]);