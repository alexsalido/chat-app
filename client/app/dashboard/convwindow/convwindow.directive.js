'use strict';

angular.module('chatApp')
	.directive('convWindow', function (scribble, socket, Auth, Group, Conversation, $mdSidenav, $mdBottomSheet, $mdToast, $mdDialog) {
		return {
			templateUrl: 'app/dashboard/convwindow/convwindow.html',
			restrict: 'E',
			replace: true,
			scope: {},
			controller: function ($scope) {
				$scope.me = Auth.getCurrentUser();
				$scope.showDialog = false;

				$scope.keyPressed = function (roomId, event) {
					if (event.which === 13 && !event.shiftKey) {
						event.preventDefault();
						$scope.sendMessage(roomId);
					}
				};

				$scope.sendMessage = function (roomId, isScribble) {
					if (!!$scope.message && ($scope.activeConv.online || !!$scope.activeConv.members)) {

						//update lastUpdated property
						$scope.activeConv.lastUpdated = Date.now();

						var message = {
							text: $scope.message,
							scribble: !!isScribble,
							sentBy: {
								_id: $scope.me._id,
								name: $scope.me.name,
								img: $scope.me.img
							}
						};

						socket.sendMessage(roomId, message, !!$scope.activeConv.members);

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
							user: $scope.me._id,
							email: $scope.me.email
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
						}, function () {
							socket.deleteConversation($scope.activeConv._id);
						}, function (err) {
							$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
						});
					}
				};

				$scope.kick = function (user) {
					Group.removeParticipant({
						id: $scope.activeConv._id
					}, {
						user: user._id,
						email: user.email
					}, function (res) {
						$mdToast.show($mdToast.simple().position('top right').textContent(res.message).action('OK'));
						socket.kick($scope.activeConv._id, user._id);
					}, function (err) {
						$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
					});
				};

				$scope.toggleSidenav = function (id) {
					$mdSidenav(id).toggle();
				};

				$scope.showEmojis = function (event) {
					var element = document.getElementById('conv-box');
					$mdBottomSheet.show({
						templateUrl: 'app/dashboard/views/emojis.html',
						parent: element,
						scope: $scope,
						preserveScope: true,
						clickOutsideToClose: true,
						targetEvent: event
					});
				};

				//|**	          **|//
				//| Scribble Dialog |//
				//|**	          **|//

				$scope.showScribbleDialog = function (event) {
					$mdDialog.show({
						scope: $scope,
						preserveScope: true,
						templateUrl: 'app/dashboard/views/newScribble.html',
						parent: angular.element(document.body),
						targetEvent: event,
						clickOutsideToClose: true,
						onComplete: function () {
							$scope.showDialog = true;
							scribble.setCanvas('scribble-container');
						}
					}).then(function () {
						$scope.showDialog = false;
					}, function () {
						$scope.showDialog = false;
					});
				};

				$scope.customOptions = {
					size: 30,
					roundCorners: false,
					total: 16,
					randomColors: 16
				};

				$scope.$watch('selectedColor', function (newVal) {
					scribble.setColor(newVal);
				});

				$scope.sendScribble = function () {
					if ($scope.activeConv.online || !!$scope.activeConv.members) {
						$scope.message = scribble.getCanvas().toDataURL();
						// $scope.message = lzwCompress.pack(scribble.getCanvas().toDataURL());
						$scope.sendMessage($scope.activeConv._id, true);
						scribble.clearCanvas();
						$mdDialog.hide();
					}
				};

				$scope.cancel = function () {
					scribble.clearCanvas();
					$mdDialog.cancel();
				};

				//|**	 **|//
				//| Events |//
				//|**	 **|//

				$scope.$on('convWindow:open', function (event, user, conversation) {
					$scope.activeConv = user;
					$scope.conversation = conversation;
					$scope.toggleSidenav('left-toolbar'); //only executed if displayed in small window
				});

				$scope.$on('convWindow:update', function (event, user) {
					if (!!$scope.activeConv && (user._id === $scope.activeConv._id)) {
						$scope.activeConv = user;
					}
				});

				$scope.$on('convWindow:deleted', function (event, item) {
					if ($scope.activeConv._id === item._id) {
						$scope.$emit('convWindow:change');
					}
				});
			}
		};
	});
