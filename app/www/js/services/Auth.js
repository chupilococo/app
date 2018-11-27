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