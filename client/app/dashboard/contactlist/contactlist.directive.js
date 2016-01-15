'use strict';

angular.module('chatApp')
	.directive('contactList', function ($mdSidenav, Auth, socket, $mdToast) {
		return {
			templateUrl: 'app/dashboard/contactlist/contactlist.html',
			restrict: 'E',
			replace: true,
			scope: {},
			controller: function ($scope, $element, $attrs) {
				$scope.me = Auth.getCurrentUser();

				$scope.pending = $scope.me.pending;
				socket.syncPending($scope.pending);

				$scope.sent = $scope.me.sent;
				socket.syncSent($scope.sent);

				$scope.requests = $attrs.requests || false;

				//friend request received
				$scope.$watch('pending.length', function (newVals, oldVals) {
					if (newVals != oldVals) {
						$mdToast.show($mdToast.simple().position('top right').textContent('Friend request received.').action('OK'));
						$scope.$emit('contactListUpdate');
					}
				}, true);

			},

			link: function (scope, element, attrs) {
				scope.requests = attrs.requests || false;
			}
		};
	});
