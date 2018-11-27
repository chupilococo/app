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
