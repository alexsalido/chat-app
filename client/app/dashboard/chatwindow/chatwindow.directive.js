'use strict';

angular.module('chatApp')
	.directive('chatWindow', function (Auth, socket, Group, $mdSidenav, $mdBottomSheet) {
		return {
			templateUrl: 'app/dashboard/chatwindow/chatwindow.html',
			restrict: 'E',
			replace: true,
			scope: {},
			controller: function ($scope) {
				$scope.me = Auth.getCurrentUser();

				$scope.toggleSidenav = function (id) {
					$mdSidenav(id).toggle();
				};

				$scope.keyPressed = function (roomId, event) {
					if (event.which === 13 && !event.shiftKey) {
						event.preventDefault();
						$scope.sendMessage(roomId);
					}
				};

				$scope.sendMessage = function (roomId) {
					if (!!$scope.message && ($scope.activeConv.online || !!$scope.activeConv.members)) {
						socket.sendMessage(roomId, $scope.message, !!$scope.activeConv.members);

						$scope.conversation.messages.push({
							text: $scope.message,
							sentBy: $scope.me._id
						});

						$scope.message = '';
					}
				};

				$scope.showEmojis = function (ev) {
					var element = document.getElementById('chat-box');
					$mdBottomSheet.show({
						templateUrl: 'app/dashboard/views/emojis.html',
						parent: element,
						scope: $scope,
						preserveScope: true,
						clickOutsideToClose: true,
						targetEvent: ev
					});
				};

				$scope.deleteConv = function (id) {
					$mdSidenav(id).toggle();

					if (!!$scope.activeConv.members) {
						socket.exitGroup($scope.activeConv._id);
					} else {
						socket.deleteConversation($scope.activeConv._id);
					}
				};

				$scope.kick = function (id) {
					socket.kick($scope.activeConv._id, id);
				};

				$scope.$on('openConv', function (event, user, conversation) {
					$scope.activeConv = user;
					$scope.conversation = conversation;
					$scope.toggleSidenav('left-toolbar'); //only executed if displayed in small window
				});

				$scope.$on('convWindow:update', function (event, user) {
					if (user._id === $scope.activeConv._id) {
						$scope.activeConv = user;
					}
				});
			}
		};
	});
