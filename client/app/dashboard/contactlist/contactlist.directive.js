'use strict';

angular.module('chatApp')
	.directive('contactList', function ($mdSidenav, Auth, socket, $mdToast) {
		return {
			templateUrl: 'app/dashboard/contactlist/contactlist.html',
			restrict: 'E',
			replace: true,
			scope: {
				filter: '='
			},
			controller: function ($scope, $element, $attrs) {
				$scope.me = Auth.getCurrentUser();

				$scope.pending = $scope.me.pendingRequests;
				socket.syncPending($scope.pending, pendingRequestsUpdated);

				$scope.sent = $scope.me.sentRequests;
				socket.syncSent($scope.sent);

				$scope.contacts = $scope.me.contacts;
				socket.syncContacts($scope.contacts, contactsUpdated);

				$scope.requests = $attrs.requests || false;

				$scope.friendRequestAccepted = function (user){
					socket.friendRequestAccepted(user);
				};

				$scope.friendRequestRejected = function (user){
					socket.friendRequestRejected(user);
				};

				$scope.openChat = function (userId) {
					$scope.$emit('openChat', userId);
				};

				function contactsUpdated (event, item, array) {
					if (event == 'created') {
						$mdToast.show($mdToast.simple().position('top right').textContent(item.email + ' is now your friend.').action('OK'));
					}
				}

				function pendingRequestsUpdated(event, item, array) {
					if (event == 'created') {
						$mdToast.show($mdToast.simple().position('top right').textContent('Friend request received.').action('OK'));
						$scope.$emit('contactListUpdate');
					}
				}
			},

			link: function (scope, element, attrs) {
				scope.requests = attrs.requests || false;
			}
		};
	});
