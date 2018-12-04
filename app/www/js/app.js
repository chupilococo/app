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
        'tab-mascotas': {
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

.constant('API_SERVER', 'http://localhost/app/api/public');