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
			    console.log(datos);
				return $http.post(API_SERVER +'/mascotas',datos,{
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
                return $http.put(API_SERVER + '/mascotas/downvote/'+id,null,{
                     headers: {
                         'X-Token': Auth.getToken()
                     }
				 });
			},
			update:function (data) {
			    console.log(data)
				return $http.put(API_SERVER + '/mascotas/'+data.id_mascota,data,{
					headers: {
						'X-Token': Auth.getToken()
					}
				});
			}
		};
	}
]);
