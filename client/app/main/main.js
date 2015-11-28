'use strict';

angular.module('chatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
		resolve: {
			//check if user is logged in before displaying the landing page, if logged in redirect to dashboard
			factory: function ($location, $http, $q) {
				var deferred = $q.defer();
				$http.get('/api/users/me').then(function(res) {
					$location.path('/dashboard');
					deferred.reject();
				}).catch(function(err){
					deferred.resolve(true);
					console.log("User is not logged in, no need to re-route");
				});
				return deferred.promise;
			}
		}
      });
  });
