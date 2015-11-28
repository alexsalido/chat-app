'use strict';

angular.module('chatApp')
	.controller('MainCtrl', function ($scope, $http, socket, $location, $mdDialog) {

		$scope.awesomeThings = [];

		$http.get('/api/things').success(function (awesomeThings) {
			$scope.awesomeThings = awesomeThings;
			socket.syncUpdates('thing', $scope.awesomeThings);
		});

		$scope.showSignup = function (ev) {
			$mdDialog.show({
				controller: 'SignupCtrl',
				templateUrl: 'app/account/signup/signup.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				locals: {
					showLogin: $scope.showLogin
				}
			});
		};

		$scope.showLogin = function (ev) {
			$mdDialog.show({
				controller: 'LoginCtrl',
				templateUrl: 'app/account/login/login.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				locals: {
					showSignup: $scope.showSignup
				}
			});
		};

		// $scope.addThing = function() {
		//   if($scope.newThing === '') {
		//     return;
		//   }
		//   $http.post('/api/things', { name: $scope.newThing });
		//   $scope.newThing = '';
		// };
		//
		// $scope.deleteThing = function(thing) {
		//   $http.delete('/api/things/' + thing._id);
		// };

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('thing');
		});
	});
