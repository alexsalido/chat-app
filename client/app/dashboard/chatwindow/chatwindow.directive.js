'use strict';

angular.module('chatApp')
	.directive('chatWindow', function (Auth, socket, Group, Conversation, $mdSidenav, $mdBottomSheet, $mdToast, $mdDialog) {
		return {
			templateUrl: 'app/dashboard/chatwindow/chatwindow.html',
			restrict: 'E',
			replace: true,
			scope: {},
			controller: function ($scope) {
				$scope.me = Auth.getCurrentUser();

				$scope.keyPressed = function (roomId, event) {
					if (event.which === 13 && !event.shiftKey) {
						event.preventDefault();
						$scope.sendMessage(roomId);
					}
				};

				$scope.sendMessage = function (roomId) {
					if (!!$scope.message && ($scope.activeConv.online || !!$scope.activeConv.members)) {
						socket.sendMessage(roomId, $scope.message, !!$scope.activeConv.members);

						var message = {
							text: $scope.message,
							sentBy: $scope.me._id
						};

						$scope.conversation.messages.push(message);

						if (!!$scope.activeConv.online) {
							//save message to conversation
							Conversation.message({
								id: $scope.activeConv._id
							}, {
								msg: message,
								users: [$scope.me._id, $scope.activeConv._id]
							}, function () {}, function (err) {
								$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
							});
						} else if (!!$scope.activeConv.members) {
							//save message to group
							Group.message({
								id: $scope.activeConv._id
							}, {
								msg: message
							}, function () {}, function (err) {
								$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
							});
						}
						$scope.message = '';
					}
				};

				$scope.deleteConv = function (id) {
					$mdSidenav(id).toggle();
					if (!!$scope.activeConv.members) {
						Group.removeParticipant({
							id: $scope.activeConv._id
						}, {
							user: $scope.me._id
						}, function (res) {
							socket.exitGroup($scope.activeConv._id);
							$mdToast.show($mdToast.simple().position('top right').textContent(res.message).action('OK'));
						}, function (err) {
							$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
						});
					} else {
						Conversation.deleteFromUser({
							id: $scope.me._id
						}, {
							users: [$scope.me._id, $scope.activeConv._id]
						}, function (res) {
							socket.deleteConversation($scope.activeConv._id);
						}, function (err) {

						});
					}
				};

				$scope.kick = function (id) {
					Group.removeParticipant({
						id: $scope.activeConv._id
					}, {
						user: id
					}, function (res) {
						$mdToast.show($mdToast.simple().position('top right').textContent(res.message).action('OK'));
						socket.kick($scope.activeConv._id, id);
					}, function (err) {
						$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
					});
				};

				$scope.toggleSidenav = function (id) {
					$mdSidenav(id).toggle();
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

				$scope.showScribbleDialog = function (ev) {
					$mdDialog.show({
						scope: $scope,
						preserveScope: true,
						templateUrl: 'app/dashboard/views/scribble.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true,
					});
				};

				//|**	 **|//
				//| Events |//
				//|**	 **|//

				$scope.$on('openConv', function (event, user, conversation) {
					$scope.activeConv = user;
					$scope.conversation = conversation;
					$scope.toggleSidenav('left-toolbar'); //only executed if displayed in small window
				});

				$scope.$on('convWindow:update', function (event, user) {
					if (!!$scope.activeConv && user._id === $scope.activeConv._id) {
						$scope.activeConv = user;
					}
				});
			}
		};
	});
