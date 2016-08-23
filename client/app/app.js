'use strict';

angular.module('chatApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'btford.socket-io',
        'ngMaterial',
        'ngMessages',
        'ngAnimate',
        'vTabs',
        'angularFileUpload',
        'ngjsColorPicker'
    ])
    .config(function($routeProvider, $locationProvider, $httpProvider, $mdIconProvider, emojifyProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('authInterceptor');

        //angular material icons
        $mdIconProvider
            .icon('plus_one', 'assets/images/svg/plus_one.svg')
            .icon('attachment', 'assets/images/svg/attachment.svg')
            .icon('chat_bubble', 'assets/images/svg/chat_bubble.svg')
            .icon('close', 'assets/images/svg/close.svg')
            .icon('contacts', 'assets/images/svg/contacts.svg')
            .icon('face', 'assets/images/svg/face.svg')
            .icon('facebook', 'assets/images/svg/facebook.svg')
            .icon('fingerprint', 'assets/images/svg/fingerprint.svg')
            .icon('info', 'assets/images/svg/info.svg')
            .icon('more_vert', 'assets/images/svg/more_vert.svg')
            .icon('more_horiz', 'assets/images/svg/more_horiz.svg')
            .icon('search', 'assets/images/svg/search.svg')
            .icon('search_black', 'assets/images/svg/search_black.svg')
            .icon('twitter', 'assets/images/svg/twitter.svg')
            .icon('insert_emoticon', 'assets/images/svg/insert_emoticon.svg')
            .icon('send', 'assets/images/svg/send.svg')
            .icon('back', 'assets/images/svg/back.svg')
            .icon('edit', 'assets/images/svg/edit.svg')
            .icon('done', 'assets/images/svg/done.svg')
            .icon('add', 'assets/images/svg/add.svg')
            .icon('person_add', 'assets/images/svg/person_add.svg')
            .icon('camera', 'assets/images/svg/camera.svg')
            .icon('scribble', 'assets/images/svg/scribble.svg')
            .icon('schedule', 'assets/images/svg/schedule.svg')
            .icon('admin', 'assets/images/svg/admin.svg')
            .icon('menu', 'assets/images/svg/menu.svg')
            .icon('emojis-people', 'assets/images/svg/emojis-people.svg')
            .icon('emojis-nature', 'assets/images/svg/emojis-nature.svg')
            .icon('emojis-objects', 'assets/images/svg/emojis-objects.svg')
            .icon('emojis-places', 'assets/images/svg/emojis-places.svg')
            .icon('emojis-symbols', 'assets/images/svg/emojis-symbols.svg');

        // emojifyProvider.setConfig('assets/emojis');

    })

.factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
    return {
        // Add authorization token to headers
        request: function(config) {
            config.headers = config.headers || {};
            if ($cookieStore.get('token')) {
                config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
            }
            return config;
        },

        // Intercept 401s and redirect you to home
        responseError: function(response) {
            if (response.status === 401) {
                $location.path('/');
                // remove any stale tokens
                $cookieStore.remove('token');
                return $q.reject(response);
            } else {
                return $q.reject(response);
            }
        }
    };
})

.run(function($rootScope, $location, Auth) {
    // Redirect to home if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function(event, next) {
        Auth.isLoggedInAsync(function(loggedIn) {
            if (next.authenticate && !loggedIn) {
                event.preventDefault();
                $location.path('/');
            }
        });
    });
});
