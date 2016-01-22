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
				$scope.contacts = $scope.me.contacts;

				$scope.conversations = $scope.me.conversations;
				socket.syncConversations($scope.conversations);

				$scope.activeTabIndex = 0;

				$scope.toggleContactInfo = function () {
					$mdSidenav('contact-info').toggle();
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

				$scope.$on('openChat', function (ev, userId) {

					$scope.activeChat = _.find($scope.contacts, {
						_id: userId
					});

					$scope.conversation = _.find($scope.conversations, function (conversation) {
						if (conversation.members.indexOf(userId) !== -1) {
							return true;
						}
					});

					if (!$scope.conversation) {
						//create dummy conversation
						$scope.conversation = {
							members: [userId, $scope.me._id],
							messages: []
						};
						$scope.conversations.push($scope.conversation);
					}
				});
			}
		};
	});
