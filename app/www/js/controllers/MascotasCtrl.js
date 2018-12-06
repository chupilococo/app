angular.module('dcPets.controllers')
.controller('MascotasCtrl', [
	'$scope',
	'$ionicPopup',
	'Mascota',
	function($scope,$ionicPopup,Mascota) {
		$scope.mascotas = [];

		let loadContent=function(){
      Mascota.todos().then(function(response) {
          $scope.mascotas = response.data;
          return Promise.resolve(response.data);
        }, function() {
        return $ionicPopup.alert({
            title: 'Upss',
            template: 'Puede que haya habido un error \n' +
              'proba de nuevo, en un rato...'
          });
        });
    };

		$scope.$on('$ionicView.beforeEnter', function() {
          loadContent();
	    });

		  $scope.doRefresh=function(){
        loadContent();
        $scope.$broadcast('scroll.refreshComplete');
      };

        $scope.upvote=function(id){
            Mascota.upvote(id);
        	//console.log('se voto por la mascota '+id);
        };
        $scope.downvote=function(id){
        	Mascota.downvote(id);
        };
	}
]);
