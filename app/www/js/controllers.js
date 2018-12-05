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