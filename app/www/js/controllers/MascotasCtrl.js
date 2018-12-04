angular.module('dcPets.controllers')
.controller('MascotasCtrl', [
	'$scope',
	'Mascota',
	function($scope, Mascota) {
		$scope.mascotas = [];
		$scope.$on('$ionicView.beforeEnter', function() {
	        Mascota.todos()
			.then(function(response) {
				console.log(response);
				$scope.mascotas = response.data;
			}, function() {
				alert("TODO MAL AAAHHHHHH");
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