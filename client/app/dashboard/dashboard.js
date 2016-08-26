'use strict';

angular.module('chatApp')
    .config(function($routeProvider, emojifyProvider) {
        $routeProvider
            .when('/dashboard', {
                templateUrl: 'app/dashboard/dashboard.html',
                controller: 'DashboardCtrl',
                resolve: {
                    factory: function($location, $http, $q, Auth, socket) {

                        var deferred = $q.defer();

                        function getEmojis() {
                            return new Promise(function(resolve) {
                                $http.get('/api/emojis').then(function(res) {
                                    emojifyProvider.setEmojis(res.data);
                                    resolve();
                                }).catch(function() {
                                    resolve();
                                    console.log('Emojis couldn\'t be loaded');
                                });
                            });
                        }

                        $q.all([Auth.isLoggedInAsync(function(loggedIn) {
                            return new Promise(function(resolve, reject) {
                                if (!loggedIn) {
                                    $location.path('/');
                                    return reject('Must be logged in to access');
                                } else {
                                    socket.createSocket(Auth.getCurrentUser()._id, function(err) {
                                        if (err) return reject();
                                        resolve();
                                    });
                                }
                            });
                        }), getEmojis()]).then(function success() {
                            deferred.resolve(true);
                        }, function error() {
                            deferred.reject();
                        });

                        return deferred.promise;
                    }
                }
            });
    });
