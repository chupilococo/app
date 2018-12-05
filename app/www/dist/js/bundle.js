angular.module('dcPets', ['ionic', 'dcPets.controllers', 'dcPets.services'])
.run(function($ionicPlatform, $rootScope, $ionicPopup,$state, Auth) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$stateChangeStart', function(event, toState){
    console.log("Cambiando la vista a : ", toState);
    if(toState.data != undefined && toState.data.requiresAuth == true) {
      if(!Auth.isLogged()) {
        event.preventDefault();
        $ionicPopup.alert({
          title: 'Acceso denegado',
          template: 'Tenés que estar logueado para poder acceder a esta pantalla.'
        }).then(function() {
                $state.go('tab.login');
            })
      }
    }else if(toState.data != undefined && toState.data.requiresGuest == true) {
      if(Auth.isLogged()) {
          event.preventDefault();
          $state.go(toState.data.redirectTo);
        }
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })
    .state('tab.mascotas', {
        url: '/mascotas',
        views: {
          'tab-mascotas': {
            templateUrl: 'templates/tabs-mascotas.html',
            controller: 'MascotasCtrl'
          }
        }
    })
    .state('tab.mascotas-nuevo', {
      url: '/mascotas/nuevo',
      views: {
          'tab-perfil': {
          templateUrl: 'templates/tabs-mascotas-nuevo.html',
          controller: 'MascotasNuevoCtrl'
        }
      },
      data: {
        requiresAuth: true
      }
    })
      .state('tab.perfil', {
          url: '/perfil',
          data: {
              requiresAuth: true
          },
          views: {
              'tab-perfil': {
                  templateUrl: 'templates/tabs-perfil.html',
                  controller: 'PerfilCtrl'
              }
          }
      })
    .state('tab.mascotas-detalle', {
      url: '/mascotas/:id',
      views: {
        'tab-mascotas': {
          templateUrl: 'templates/tabs-mascotas-detalle.html',
          controller: 'MascotasDetalleCtrl'
        }
      }
    })
  .state('tab.login', {
    url: '/login',
    data:{
        requiresGuest:true,
        redirectTo:'tab.perfil'
    },
    views: {
      'tab-perfil': {
        templateUrl: 'templates/tab-login.html',
        controller: 'LoginCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/tab/dash');
})
.constant('API_SERVER', 'http://localhost/app/api/public')
.constant('NO_IMG', 'img/perro_404.png');
// La presencia del segundo parámetro del .module, indica
// que el módulo se está creando.
// Si se ignora, significa que estamos abriendo un 
// módulo existente.
angular.module('dcPets.controllers', [])

.controller('DashCtrl', function($scope, Mascota) {

    $scope.mascotas = [];
    $scope.$on('$ionicView.beforeEnter', function() {
        Mascota.todos()
            .then(function(response) {
                $scope.mascotas = response.data;
                // console.log(' esta es la respuesta',$scope.mascotas);
            });
    });
});
angular.module('dcPets.services', []);

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
angular.module('dcPets.controllers')
.controller('MascotasDetalleCtrl', [
	'$scope',
	'$stateParams',
	'Mascota',
	'NO_IMG',
	function($scope, $stateParams, Mascota, NO_IMG) {
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
	}
]);
angular.module('dcPets.controllers')
.controller('MascotasNuevoCtrl', [
	'$scope',
	'$state',
	'$ionicPopup',
	'Mascota',
	function($scope, $state, $ionicPopup, Mascota) {
		$scope.mascota = {
			nombre		: null,
			id_categoria: null,
			id_marca	: null,
			precio		: null,
			descripcion	: null
		};

		$scope.grabar = function(mascota) {
			 Mascota.crear(mascota)
				.then(function(response) {
					let responseInfo = response.data;
					if(responseInfo.status == 1) {
						$ionicPopup.alert({
							title: 'Éxito!',
							template: 'El mascota fue creado exitosamente! :D'
						}).then(function() {
							// Lo redireccionamos al listado, pero luego de que cierren el mensaje.
							$state.go('tab.mascotas');
						});
					} else if(responseInfo.status == 0) {
						$ionicPopup.alert({
							title: 'Error',
							template: 'Oops! Hubo un error al grabar en nuestro servidor. Por favor, probá de nuevo.'
						});
					}
				});
		}; // EZ PZ - Se pronuncia: "Easy peasy".
	}
]);
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
angular.module('dcPets.services')
.factory('Auth', [
	'$http',
	'API_SERVER',
	function($http, API_SERVER) {
		let token 		= null,
			userData 	= null;

		function login(user) {
			return $http.post(API_SERVER + '/login', user).then(function(response) {
				let responsePayload = response.data;
				if(responsePayload.status == 1) {
					token = responsePayload.token;
					console.log(responsePayload);
					userData = {
						id		: responsePayload.user.id,
						usuario : responsePayload.user.usuario
					};
					return true;
				} else {
					return false;
				}
			});
		}

		function isLogged() {
			if(token != null) {
				return true;
			} else {
				return false;
			}
		}

		function getToken() {
			return token;
		}
		function getId () {
			console.log(userData);
			return userData.id;
        }
		return {
			login: login,
			isLogged: isLogged,
			getToken: getToken,
			getId: getId,
		};
	}
]);
angular.module('dcPets.services')
.factory('Mascota', [
	'$http',
	'API_SERVER',
	'Auth',
	function($http, API_SERVER, Auth) {

		return {
			todos: function() {
				return $http.get(API_SERVER + '/mascotas');
			},
            getByPerfil:function (id) {
				return $http.get(API_SERVER+ '/mascotas/perfil/'+id,{
                        headers: {
                            'X-Token': Auth.getToken()
                        }
                    });
            },
			uno: function(id) {
				return $http.get(API_SERVER + '/mascotas/' + id);
			},
			crear: function(datos) {
				return $http.post(API_SERVER + '/mascotas', datos, {
					headers: {
						'X-Token': Auth.getToken()
					}
				})
                },
            upvote:function(id) {
				console.log('upvote:',id);
                return $http.put(API_SERVER + '/mascotas/upvote/'+id,null, {
                    headers: {
                        'X-Token': Auth.getToken()
                    }
				});
			},
            downvote:function(id) {
				console.log('downvote:',id);
                return $http.put(API_SERVER + '/mascotas/downpdate/'+id,null,{
                     headers: {
                         'X-Token': Auth.getToken()
                     }
				 });
			}
		};
	}
]);