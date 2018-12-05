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