'use strict';

angular.module('chatApp')
	.directive('chatWindow', function ($mdSidenav, $mdBottomSheet, Auth, socket, messages) {
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
					socket.sendMessage(roomId, $scope.message);

					$scope.conversation.messages.push({
						text: $scope.message,
						sentBy: $scope.me._id
					});

					$scope.message = '';
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
					socket.deleteConversation($scope.activeConv._id);
					if (id) {
						$mdSidenav(id).toggle();
					}
				};

				$scope.$on('openConv', function (ev, user, conversation) {
					console.log(user, conversation);
					$scope.activeConv = user;
					$scope.conversation = conversation;
					$scope.toggleSidenav('left-toolbar'); //only executed if displayed in small window
				});
			}
		};
	});
