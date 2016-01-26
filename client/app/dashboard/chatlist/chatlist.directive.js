'use strict';

angular.module('chatApp')
	.directive('chatList', function (Conversation, Auth, socket) {
		return {
			templateUrl: 'app/dashboard/chatlist/chatlist.html',
			restrict: 'E',
			replace: true,
			scope: {},
			controller: function ($scope) {
				$scope.me = Auth.getCurrentUser();

				$scope.conversations = $scope.me.conversations;
				socket.syncConversations($scope.conversations, conversationsUpdated);

				$scope.activeConvs = [];

				$scope.conversations.forEach(function (conversation) {
					conversation.members.splice(conversation.members.indexOf($scope.me._id), 1);

					addToActiveConvs(conversation.members[0]);

				});

				$scope.convSelected = function (user) {
					var conversation = _.find($scope.conversations, function (conversation) {
						if (conversation.members.indexOf(user._id) !== -1) {
							return true;
						}
					});

					if (!conversation) {
						_user = user;
						socket.createConversation(user._id);
					} else {
						$scope.$emit('convSelected', user, conversation);
					}
				};

				//**	 **//
				// Functions  //
				//**	 **//
				function addToActiveConvs(id) {
					var contact = _.find($scope.me.contacts, {
						_id: id
					});

					if (contact) {
						$scope.activeConvs.unshift(contact);
					}
				}

				var _user; //auxilary variable to avoid getting user information from contacts
				function conversationsUpdated(event, conversation) {
					if (event == 'created') {
						addToActiveConvs(conversation.members[0]);
						$scope.$emit('convSelected', _user, conversation);

					} else if (event == 'deleted') {
						var target = _.find($scope.activeConvs, {
							_id: conversation.members[0]
						});

						var index = $scope.activeConvs.indexOf(target);

						$scope.activeConvs.splice(index, 1);
						if ($scope.activeConvs.length > 0) {
							$scope.convSelected($scope.activeConvs[0]);
						}
					}
				}

				//**	 **//
				// Events  //
				//**	 **//

				$scope.$on('newConversation', function (event, user) {
					$scope.convSelected(user);
				});

				//trigger default state
				if ($scope.activeConvs.length > 0) {
					setTimeout($scope.convSelected, 0, $scope.activeConvs[0]);
				}

			},
			link: function (scope, element, attrs) {}
		};
	});
