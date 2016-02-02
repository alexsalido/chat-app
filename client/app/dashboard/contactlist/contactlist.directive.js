'use strict';

angular.module('chatApp')
	.directive('contactList', function ($mdSidenav, Auth, socket, $mdToast, $mdDialog) {
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

				$scope.friendRequestAccepted = function (user) {
					Auth.acceptFriendRequest(user).then(function () {
						socket.friendRequestAccepted(user);
					});
				};

				$scope.friendRequestRejected = function (user) {
					Auth.rejectFriendRequest(user).then(function () {
						socket.friendRequestRejected(user);
					});
				};

				$scope.contactSelected = function (user) {
					$mdSidenav('contact-list').toggle();
					$scope.$emit('contactList:selected', user);
				};

				$scope.deleteContact = function (ev, name, id) {
					var confirm = $mdDialog.confirm()
						.title('Please confirm action')
						.textContent('Are you sure you want to remove "' + name + '" from your contact list?')
						.targetEvent(ev)
						.ok('Yes')
						.cancel('No');
					$mdDialog.show(confirm).then(function () {
						Auth.deleteContact(id).then(function () {
							socket.deleteContact(id);
						});
					}, function () {});
				};

				function contactsUpdated(event, item) {
					if (event === 'created') {
						$mdToast.show($mdToast.simple().position('top right').textContent(item.email + ' is now your friend.').action('OK'));
					} else if (event === 'updated') {
						$scope.$emit('contactList:updated', item);
					} else if (event === 'deleted') {
						$scope.$emit('contactList:deleted', item);
					}
				}

				function pendingRequestsUpdated(event) {
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
