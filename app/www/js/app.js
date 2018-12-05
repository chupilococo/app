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