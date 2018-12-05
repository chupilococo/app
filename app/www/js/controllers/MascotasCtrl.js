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
				console.log($scope.mascotas);
			}, function() {
                $ionicPopup.alert({
                    title: 'Upss',
                    template: 'Puede que haya habido un error \n' +
						'proba de nuevo, en un rato...'
                });
			});
	    });
        $scope.upvote=function(id){
            Mascota.upvote(id);
        	console.log('se voto por la mascota '+id);
        };
        $scope.downvote=function(id){
        	Mascota.downvote(id);
            console.log('se desvoto por la mascota '+id);
        };
	}
]);