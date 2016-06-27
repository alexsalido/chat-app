'use strict';

angular.module('chatApp')
	.directive('contactList', function ($mdSidenav, Auth, socket, $mdToast, $mdDialog) {
		return {
			templateUrl: 'app/dashboard/contactlist/contactlist.html',
			restrict: 'E',
			scope: {
				filter: '='
			},
			controller: function ($scope, $element, $attrs) {
				$scope.errors = {};

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

				$scope.toggleSidenav = function (id) {
					$mdSidenav(id).toggle();
				};

				$scope.showNewContactDialog = function (ev) {
					$mdDialog.show({
						scope: $scope,
						preserveScope: true,
						templateUrl: 'app/dashboard/views/newcontact.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true
					});
				};

				$scope.sendFriendRequest = function (form) {
					$scope.submitted = true;
					if (form.$valid) {
						Auth.isRegistered($scope.newContactEmail)
							.then(function (data) {
								Auth.sendFriendRequest(data._id).then(function (res) {
									$mdToast.show($mdToast.simple().position('top right').textContent(res.message).action('OK'));
									socket.friendRequest(data._id, $scope.me._id);
									$mdDialog.cancel();
									$scope.submitted = false;
									$scope.newContactEmail = '';
								}).catch(function (err) {
									$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
								});
							})
							.catch(function (err) {
								form[err.field].$setValidity('mongoose', false);
								$scope.errors.other = err.message;
							});
					}
				};

				$scope.deleteContact = function (event, contact) {
					var confirm = $mdDialog.confirm()
						.title('Please confirm action')
						.textContent('Are you sure you want to remove "' + contact.name + '" from your contact list?')
						.targetEvent(event)
						.ok('Yes')
						.cancel('No');
					$mdDialog.show(confirm).then(function () {
						Auth.deleteContact(contact._id).then(function () {
							socket.deleteContact(contact._id);
						}).catch(function (err) {
							$mdToast.show($mdToast.simple().position('top right').textContent(data.err).action('OK'));
						});
					}, function () {});
				};

				$scope.cancel = function () {
					$mdDialog.cancel();
					$scope.submitted = false;
				};

				function contactsUpdated(event, item) {
					if (event === 'created') {
						$mdToast.show($mdToast.simple().position('top right').textContent(item.email + ' is now your friend.').action('OK'));
					} else if (event === 'updated') {
						$scope.$emit('contactList:updated', item);
					} else if (event === 'deleted') {
						// $scope.$emit('contactList:deleted', item);
					}
				}

				function pendingRequestsUpdated(event) {
					if (event === 'created') {
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
