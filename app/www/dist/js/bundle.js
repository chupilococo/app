angular.module('dcPets', ['ionic', 'dcPets.controllers', 'dcPets.services'])
// funcionalidades del dispositivo están disponibles.
.run(function($ionicPlatform, $rootScope, $ionicPopup,$state, Auth) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
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

// Config permite definir configuraciones de los módulos (providers).
// Por ejemplo, configurar el módulo de rutas.
// Ionic no utiliza ngRoute, sino el ui-router.
// Este módulo contiene varias mejoras con respecto a
// ngRoute. Principalmente, permite el uso de subvistas.
// Una cosa a notar, es que con el ngRoute, utilizaban "routes".
// Con el ui-router, se habla de "states".
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
    .state('tab.productos', {
        url: '/productos',
        views: {
          'tab-productos': {
            templateUrl: 'templates/tabs-productos.html',
            controller: 'ProductosCtrl'
          }
        }
    })
    .state('tab.productos-nuevo', {
      url: '/productos/nuevo',
      views: {
        'tab-productos': {
          templateUrl: 'templates/tabs-productos-nuevo.html',
          controller: 'ProductosNuevoCtrl'
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



    .state('tab.productos-detalle', {
      url: '/productos/:id',
      views: {
        'tab-productos': {
          templateUrl: 'templates/tabs-productos-detalle.html',
          controller: 'ProductosDetalleCtrl'
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

.constant('API_SERVER', 'http://localhost/app/api/public');
// La presencia del segundo parámetro del .module, indica
// que el módulo se está creando.
// Si se ignora, significa que estamos abriendo un 
// módulo existente.
angular.module('dcPets.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

angular.module('dcPets.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

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
						$state.go('tab.productos');
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
.controller('PerfilCtrl', [
	'$scope',
	'Auth',
	function($scope, $ionicPopup, $state, Auth) {
		$scope.perfil = {
		};
	}
]);
// Agregamos un nuevo controller al módulo de controllers que ionic
// definió ('dcPets.controllers').
angular.module('dcPets.controllers')
.controller('ProductosCtrl', [
	'$scope',
	// 'Producto' sale del servicio "Mascotas.js".
	'Producto',
	function($scope, Producto) {
		// $scope es el servicio que sirve para vincular los datos y
		// funciones que queremos que estén disponibles en la vista.
		$scope.productos = [];

		// Justo de antes de entrar a la vista, le pedimos
		// que traiga los productos.
		$scope.$on('$ionicView.beforeEnter', function() {
	        Producto.todos()
			.then(function(response) {
				// Resolve
				console.log(response);
				$scope.productos = response.data;
			}, function() {
				// Reject
				alert("TODO MAL AAAHHHHHH");
			});
	    });		
	}
]);
angular.module('dcPets.controllers')
.controller('ProductosDetalleCtrl', [
	'$scope',
	'$stateParams',
	'Producto',
	function($scope, $stateParams, Producto) {
		$scope.producto = {
			id_producto: null,
			nombre: null,
			categoria: null,
			marca: null,
			precio: null,
			descripcion: null
		};

		// $http.get(API_SERVER + '/productos/' + $stateParams.id)
		Producto.uno($stateParams.id)
			.then(function(response) {
				$scope.producto = response.data;
			}); // papita :3
	}
]);
angular.module('dcPets.controllers')
.controller('ProductosNuevoCtrl', [
	'$scope',
	'$state',
	'$ionicPopup',
	'Producto',
	function($scope, $state, $ionicPopup, Producto) {
		$scope.producto = {
			nombre		: null,
			id_categoria: null,
			id_marca	: null,
			precio		: null,
			descripcion	: null
		};

		$scope.grabar = function(producto) {
			// $http.post(API_SERVER + '/productos', producto)
			Producto.crear(producto)
				.then(function(response) {
					let responseInfo = response.data;
					if(responseInfo.status == 1) {
						$ionicPopup.alert({
							title: 'Éxito!',
							template: 'El producto fue creado exitosamente! :D'
						}).then(function() {
							// Lo redireccionamos al listado, pero luego de que cierren el mensaje.
							$state.go('tab.productos');
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
					userData = {
						id		: responsePayload.id,
						usuario : responsePayload.usuario
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

		return {
			login: login,
			isLogged: isLogged,
			getToken: getToken,
		};
	}
]);
// Primero, abrimos el módulo de servicios, y creamos el
// nuevo servicio.
angular.module('dcPets.services')
// .factory es el método para crear nuevos servicios.
.factory('Producto', [
	'$http',
	'API_SERVER',
	'Auth',
	function($http, API_SERVER, Auth) {

		return {
			todos: function() {
				return $http.get(API_SERVER + '/productos');
			},
			uno: function(id) {
				return $http.get(API_SERVER + '/productos/' + id);
			},
			crear: function(datos) {
				return $http.post(API_SERVER + '/productos-grabar.php', datos, {
					headers: {
						'X-Token': Auth.getToken()
					}
				});
			}
		};
	}
]);