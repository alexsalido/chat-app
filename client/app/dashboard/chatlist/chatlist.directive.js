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

				$scope.groups = $scope.me.groups;
				socket.syncGroups($scope.groups, groupsUpdated);

				$scope.activeConvs = [].concat($scope.me.groups);

				//populate activeConvs
				$scope.conversations.forEach(function (conversation) {
					//Filter myself from the conversation's members
					conversation.members.splice(conversation.members.indexOf(_.find(conversation.members, {
						_id: $scope.me._id
					})), 1);

					$scope.activeConvs.unshift(conversation.members[0]);
				});

				$scope.convSelected = function (user) {
					if (!user.members) {
						//is a user
						var conversation = _.find($scope.conversations, function (conversation) {
							if (conversation.members[0]._id === user._id) {
								return true;
							}
						});

						if (!conversation) {
							socket.createConversation(user._id);
						} else {
							$scope.$emit('convSelected', user, conversation);
						}
					} else {
						//is a group
						$scope.$emit('convSelected', user, user);
					}
				};

				//**	   **//
				// Functions //
				//**	   **//
				function conversationsUpdated(event, conversation) {
					if (event === 'created') {
						$scope.activeConvs.unshift(conversation.members[0]);
						$scope.convSelected(conversation.members[0]);
					} else if (event === 'deleted') {
						//delete conversation from activeConvs
						$scope.activeConvs.splice($scope.activeConvs.indexOf(_.find($scope.activeConvs, {
							_id: conversation.members[0]._id
						})), 1);
						if ($scope.activeConvs.length > 0) {
							$scope.convSelected($scope.activeConvs[0]);
						}
					}
				}

				function groupsUpdated(event, group) {
					if (event === 'created') {
						$scope.activeConvs.unshift(group);
						$scope.$emit('convSelected', group, group);
					} else if (event === 'deleted') {
						$scope.activeConvs.splice($scope.activeConvs.indexOf(_.find($scope.activeConvs, {
							_id: group._id
						})), 1);
						if ($scope.activeConvs.length > 0) {
							$scope.convSelected($scope.activeConvs[0]);
						}
					} else if (event === 'updated') {
						$scope.activeConvs.splice($scope.activeConvs.indexOf(_.find($scope.activeConvs, {
							_id: group._id
						})), 1, group);
						$scope.$emit('convSelected', group, group);
					}
				}

				//**	 **//
				// Events  //
				//**	 **//
				$scope.$on('convList:new', function (event, user) {
					$scope.convSelected(user);
				});

				$scope.$on('convList:newGroup', function (event, group) {
					$scope.$emit('convSelected', group, group);
					$scope.activeConvs.unshift(group);
					$scope.me.groups.push(group);
				});


				$scope.$on('convList:update', function (event, user) {
					var target = _.find($scope.activeConvs, {
						_id: user._id
					});

					if (target) {
						var index = $scope.activeConvs.indexOf(target);
						$scope.activeConvs.splice(index, 1, user);
					}
				});

				//trigger default state
				if ($scope.activeConvs.length > 0) {
					setTimeout($scope.convSelected, 0, $scope.activeConvs[0]);
				}

			}
		};
	});
