angular.module('dcPets.services')
.factory('Coments', [
	'$http',
	'API_SERVER',
	'Auth',
	function($http, API_SERVER, Auth) {

		return {
      getComents:function (id) {
        return $http.get(API_SERVER+'/coments/'+id,{
          headers: {
            'X-Token': Auth.getToken()
          }
        })
      },
      crearComent:function (data) {
        return $http.post(API_SERVER+'/coments',data,{
          headers: {
            'X-Token': Auth.getToken()
          }
        })
      }

		};
	}
]);
