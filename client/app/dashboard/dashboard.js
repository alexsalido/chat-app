'use strict';

angular.module('chatApp')
  .config(function ($routeProvider, emojifyProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
		resolve: {
			factory: function ($http, $q) {
				var deferred = $q.defer();
				$http.get('/api/emojis').then(function(res) {
					emojifyProvider.setEmojis(res.data);
					deferred.resolve();
				}).catch(function(err){
					deferred.resolve();
					console.log("Emojis couldn't be loaded");
				});
				return deferred.promise;
			}
		}
      });
  });
