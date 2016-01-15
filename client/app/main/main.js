'use strict';

angular.module('chatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
		resolve: {
			//check if user is logged in before displaying the landing page, if logged in redirect to dashboard
			factory: function ($location, $http, $q, Auth) {
				var deferred = $q.defer();
				Auth.isLoggedInAsync(function(loggedIn) {
					if (loggedIn) {
						$location.path('/dashboard');
						deferred.reject();
					} else {
						deferred.resolve(true);
						console.log('User is not logged in, no need to re-route');
					}
				});
				return deferred.promise;
			}
		}
      });
  });
