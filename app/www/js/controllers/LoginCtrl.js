angular.module('dcPets.controllers')
.controller('LoginCtrl', [
	'$scope',
	'$ionicPopup',
	'$state',
	'Auth',
	function($scope, $ionicPopup, $state, Auth) {
		$scope.user = {
			usuario: null,
			password: null
		};

		$scope.login = function(user) {
			Auth.login(user).then(function(exito) {
				if(exito) {
					$ionicPopup.alert({
						title: 'Éxito',
						template: 'Bienvenido/a! Disfrutá de la app :)'
					}).then(function() {
						$state.go('tab.perfil');
					});
				} else {
					$ionicPopup.alert({
						title: 'Error',
						template: 'Parece que las credenciales no coinciden con nuestros registros. Por favor, revisá que todo esté bien y probá de nuevo.'
					});
				}
			});
		};
	}
]);