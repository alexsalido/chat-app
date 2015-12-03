'use strict';

angular.module('chatApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'ngMaterial',
  'ngMessages'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider, $mdIconProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

	//angular material icons
	$mdIconProvider
		.icon('plus_one', 'assets/svg/plus_one.svg')
		.icon('attachment', 'assets/svg/attachment.svg')
		.icon('chat_bubble', 'assets/svg/chat_bubble.svg')
		.icon('close', 'assets/svg/close.svg')
		.icon('contacts', 'assets/svg/contacts.svg')
		.icon('face', 'assets/svg/face.svg')
		.icon('facebook', 'assets/svg/facebook.svg')
		.icon('fingerprint', 'assets/svg/fingerprint.svg')
		.icon('info', 'assets/svg/info.svg')
		.icon('more_vert', 'assets/svg/more_vert.svg')
		.icon('search', 'assets/svg/search.svg')
		.icon('search_black', 'assets/svg/search_black.svg')
		.icon('twitter', 'assets/svg/twitter.svg')
		.icon('insert_emoticon', 'assets/svg/insert_emoticon.svg')
		.icon('send', 'assets/svg/send.svg')
		.icon('back', 'assets/svg/back.svg')
		.icon('edit', 'assets/svg/edit.svg')

  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to home
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to home if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $location.path('/');
        }
      });
    });
  });
