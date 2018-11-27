// angular.module is a global place for creating, registering and retrieving Angular modules
// 'dvProds' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'dvProds.services' is found in services.js
// 'dvProds.controllers' is found in controllers.js
// angular.module define o abre algún "módulo" o "componente" de
// angular. Principalmente, el módulo de la app.
// Recibe 2 parámetros:
// 1. string. El nombre del módulo. En caso de ser la app, va el
//  valor del ng-app.
// 2. Array (opcional). Lista las dependencias.
angular.module('dvProds', ['ionic', 'dvProds.controllers', 'dvProds.services'])

// El método run sirve para indicar acciones que queremos
// se ejecuten al arrancar la aplicación.
// Se lo suele utilizar para detectar qué sensores o 
// funcionalidades del dispositivo están disponibles.
.run(function($ionicPlatform, $rootScope, $ionicPopup, Auth) {
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

  // Agregamos la lógica para el bloqueo de usuarios no
  // autorizados a ciertas vistas.
  // Detectamos el cambio de rutas.
  $rootScope.$on('$stateChangeStart', function(event, toState){
    // console.log("Cambiando la vista a : ", toState);
    // toState va a tener todo el objeto que le definimos
    // a cada "state".
    // Preguntamos si esta ruta requiere autenticación
    // o no.
    /*if(toState.data != undefined && toState.data.requiresAuth == true) {
      // Verificamos si el usuario está autenticado o
      // no.
      if(!Auth.isLogged()) {
        // No está logueado, así que prohibimos el acceso.
        event.preventDefault();

        $ionicPopup.alert({
          title: 'Acceso denegado',
          template: 'Tenés que estar logueado para poder acceder a esta pantalla.'
        })
      }
    }*/
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

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  // El $stateProvider es el componente al que le agregamos las
  // rutas/states.
  $stateProvider

  // setup an abstract state for the tabs directive
  // .state define un "estado" o ruta de la app.
  // El primer parámetro, es el "nombre" del estado.
  // Es de uso interno, no se ve reflejado en la url ni
  // en la interfaz del usuario.
  // El segundo parámetro es un objeto de configuración.
  .state('tab', {
    // url: Define la url asociada a este estado.
    url: '/tab',
    // abstract define que este estado es "abstracto".
    // Los estados abstractos no pueden visualizarse
    // por su cuenta. Sirven para ser usados de base
    // por otros estados.
    abstract: true,
    // templateUrl: Define la ruta del template asociado.
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  // Cuando el nombre tiene un ".", indica que se basa
  // en otro estado.
  // "tab.dash" indica que utiliza el estado "tab" de 
  // base. 
  .state('tab.dash', {
    // En este caso, la url se _agrega_ a la del estado
    //  abstracto.
    // La ruta final sería "/tab/dash".
    url: '/dash',
    // views: Define qué vistas deben actualizarse con qué
    // contenido.
    // Las propiedades (como 'tab-dash') son los nombres
    // de la vista, y su valor la configuración.
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

    // Creamos la vista de productos.
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
      // El nombre después del ":" es el nombre de la propiedad
      // que va a tener "$stateParams" luego en el controller,
      // conteniendo el valor.
      url: '/productos/nuevo',
      views: {
        'tab-productos': {
          templateUrl: 'templates/tabs-productos-nuevo.html',
          controller: 'ProductosNuevoCtrl'
        }
      },
      // El atributo data permite definir valores que
      // queremos que tenga la ruta. Todos los valores
      // son arbitrarios.
      data: {
        requiresAuth: true
      }
    })
    .state('tab.productos-detalle', {
      // El nombre después del ":" es el nombre de la propiedad
      // que va a tener "$stateParams" luego en el controller,
      // conteniendo el valor.
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
    views: {
      'tab-perfil': {
        templateUrl: 'templates/tab-login.html',
        controller: 'LoginCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

})

// Definimos la constante con la ruta de la api.
.constant('API_SERVER', 'http://localhost/santiago/api');

// La presencia del segundo parámetro del .module, indica
// que el módulo se está creando.
// Si se ignora, significa que estamos abriendo un 
// módulo existente.
angular.module('dvProds.controllers', [])

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

angular.module('dvProds.services', [])

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

angular.module('dvProds.controllers')
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
// Agregamos un nuevo controller al módulo de controllers que ionic
// definió ('dvProds.controllers').
angular.module('dvProds.controllers')
.controller('ProductosCtrl', [
	'$scope',
	// 'Producto' sale del servicio "Producto.js".
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
angular.module('dvProds.controllers')
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
angular.module('dvProds.controllers')
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
angular.module('dvProds.services')
.factory('Auth', [
	'$http',
	'API_SERVER',
	function($http, API_SERVER) {
		// Definimos unas propiedades "privadas" para
		// almacenar los datos de la autenticación, como
		// el token, el nombre de usuario, etc.
		let token 		= null, 
			userData 	= null;

		function login(user) {
			return $http.post(API_SERVER + '/login.php', user).then(function(response) {
				// Vamos a verificar si la petición del
				// login tuvo éxito o no.
				let responsePayload = response.data;

				if(responsePayload.status == 1) {
					// Yay! Info correcta! :D
					// Registramos en las variables del
					// servicio el token y los datos
					// del usuario.
					token = responsePayload.data.token;
					userData = {
						id		: responsePayload.data.id,
						usuario : responsePayload.data.usuario
					};

					// Cuando hacemos un "return" dentro
					// de un "then", el valor retornado
					// va a llegar como parámetro para
					// el then que se haga a continuación
					// de éste.
					return true;
				} else {
					// Buuu... info errónea :(
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
			// return token != null;
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
angular.module('dvProds.services')
// .factory es el método para crear nuevos servicios.
.factory('Producto', [
	'$http',
	'API_SERVER',
	'Auth',
	function($http, API_SERVER, Auth) {
		/*function todos() {
			return $http.get(API_SERVER + '/productos');
		}

		function uno(id) {
			return $http.get(API_SERVER + '/productos/' + id);
		}

		function crear(datos) {
			return $http.post(API_SERVER + '/productos', datos);
		}

		// Los métodos que van a poder ser accedidos, los
		// debemos retornar como un objeto.
		return {
			todos: todos,
			uno: uno,
			crear: crear
		}*/

		// Los métodos que van a poder ser accedidos, los
		// debemos retornar como un objeto.
		return {
			todos: function() {
				// return $http.get(API_SERVER + '/productos');
				return $http.get(API_SERVER + '/productos.php');
			},
			uno: function(id) {
				// return $http.get(API_SERVER + '/productos/' + id);
				return $http.get(API_SERVER + '/productos-detalle.php?id=' + id);
			},
			crear: function(datos) {
				// return $http.post(API_SERVER + '/productos', datos);
				// El tercer parámetro (segundo en el caso de get y delete) es un
				// objeto de configuraciones.
				return $http.post(API_SERVER + '/productos-grabar.php', datos, {
					// "headers" permite definir encabezados para agregar a la
					// petición. El formato es la key del objeto es la key del
					// header, y el valor, el valor.
					headers: {
						// 'Content-Type': 'application/json'
						// Agregamos un header para enviar el token.
						// Nota: 'X-Token' es un nombre que inventamos nosotros.
						'X-Token': Auth.getToken()
					}
				});
			}
		};
	}
]);