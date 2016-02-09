'use strict';

angular.module('chatApp')
	.directive('chatList', function (Conversation, Auth, socket, $mdToast) {
		return {
			templateUrl: 'app/dashboard/chatlist/chatlist.html',
			restrict: 'E',
			replace: true,
			scope: {},
			controller: function ($scope) {
				$scope.me = Auth.getCurrentUser();

				//flag that indicates if the conversation should be opened upon creation
				$scope.open = false;

				$scope.conversations = $scope.me.conversations;
				socket.syncConversations($scope.conversations, function conversationsUpdated(event, conversation) {
					if (event === 'created') {
						$scope.activeConvs.unshift(conversation.members[0]);

						if ($scope.open || $scope.activeConvs.length === 1) {
							$scope.convSelected(conversation.members[0]);
						}

						$scope.open = false;
					} else if (event === 'deleted') {
						//delete conversation from activeConvs
						var target = _.find($scope.activeConvs, {
							_id: conversation.members[0]._id
						});

						if (target) {
							var index = $scope.activeConvs.indexOf(target);
							$scope.activeConvs.splice(index, 1);
							$scope.$emit('convList:deleted', conversation.members[0]);
						}
					}
				});

				$scope.groups = $scope.me.groups;
				socket.syncGroups($scope.groups, function groupsUpdated(event, group) {
					if (event === 'created') {

						$scope.activeConvs.unshift(group);

						if ($scope.open || $scope.activeConvs.length === 1) {
							$scope.convSelected(group);
						}
						$scope.open = false;
					} else if (event === 'deleted') {
						//delete group from activeConvs
						var target = _.find($scope.activeConvs, {
							_id: group._id
						});

						if (target) {
							var index = $scope.activeConvs.indexOf(target);
							$scope.activeConvs.splice(index, 1);
						}
						$scope.$emit('convList:deleted', group);
					} else if (event === 'updated') {
						$scope.activeConvs.splice($scope.activeConvs.indexOf(_.find($scope.activeConvs, {
							_id: group._id
						})), 1, group);

						if ($scope.open) {
							$scope.convSelected(group);
						}
						$scope.open = false;
					}
				});

				$scope.activeConvs = [].concat($scope.me.groups);

				// //populate activeConvs
				$scope.conversations.forEach(function (conversation) {
					$scope.activeConvs.unshift(conversation.members[0]);
				});

				$scope.convSelected = function (item) {
					$scope.activeConv = item;
					if (!item.members) {
						//is a user
						var conversation = _.find($scope.conversations, function (conversation) {
							if (conversation.members[0]._id === item._id) {
								return true;
							}
						});

						if (!conversation) {
							Conversation.addToUser({
								id: $scope.me._id
							}, {
								users: [$scope.me._id, item._id]
							}, function () {
								socket.createConversation(item._id);
							}, function (err) {
								$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
							});

						} else {
							$scope.$emit('convSelected', item, conversation);
						}
					} else {
						//is a group
						$scope.$emit('convSelected', item, item);
					}
				};

				//**	 **//
				// Events  //
				//**	 **//
				$scope.$on('convList:new', function (event, item) {
					$scope.convSelected(item);
					$scope.open = true;
				});

				$scope.$on('convList:newGroup', function (event, group) {
					$scope.open = true;
				});


				$scope.$on('convList:update', function (event, item) {
					var target = _.find($scope.activeConvs, {
						_id: item._id
					});

					if (target) {
						var index = $scope.activeConvs.indexOf(target);
						$scope.activeConvs[index] = item;
					}
				});

				$scope.$on('convList:select', function (event) {
					if ($scope.activeConvs.length > 0) {
						$scope.convSelected($scope.activeConvs[0]);
					}
				});

				//trigger default state
				if ($scope.activeConvs.length > 0) {
					setTimeout($scope.convSelected, 0, $scope.activeConvs[0]);
				}

			}
		};
	});
