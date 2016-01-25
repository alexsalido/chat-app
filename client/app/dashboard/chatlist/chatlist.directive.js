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
						socket.createConversation(user._id);
						//create dummy conversation
						conversation = {
							members: [user._id],
							messages: []
						};
						// $scope.conversations.unshift(conversation);
					}

					$scope.$emit('convSelected', user, conversation);
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

				function conversationsUpdated(event, conversation) {
					if (event === 'created') {
						addToActiveConvs(conversation.members[0]);
					}
				}

				//**	 **//
				// Events  //
				//**	 **//

				$scope.$on('newConversation', function (ev, user) {
					// $scope.activeConvs.unshift(user);
					$scope.convSelected(user);
				});

			},
			link: function (scope, element, attrs) {}
		};
	});
