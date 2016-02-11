'use strict';

angular.module('chatApp')
	.directive('chatList', function (Conversation, Auth, socket, $mdToast) {
		return {
			templateUrl: 'app/dashboard/chatlist/chatlist.html',
			restrict: 'E',
			replace: true,
			scope: {
				filter: '='
			},
			controller: function ($scope) {
				$scope.me = Auth.getCurrentUser();

				//flag that indicates if the conversation should be opened upon creation
				$scope.open = false;

				$scope.conversations = $scope.me.conversations;
				socket.syncConversations($scope.conversations, function conversationsUpdated(event, conversation) {
					if (event === 'created') {

						conversation.members[0].lastUpdated = Date.now();

						$scope.activeConvs.push(conversation.members[0]);

						if ($scope.open || $scope.activeConvs.length === 1) {
							conversation.members[0].notification = false;
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

						group.lastUpdated = Date.now();

						$scope.activeConvs.push(group);

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

						group.lastUpdated = Date.now();
						group.notification = true;

						$scope.activeConvs.splice($scope.activeConvs.indexOf(_.find($scope.activeConvs, {
							_id: group._id
						})), 1, group);

						if ($scope.activeConv._id === group._id) {
							$scope.convSelected(group);
						}
					}
				});

				$scope.activeConvs = [];

				// //populate activeConvs
				$scope.conversations.forEach(function (conversation) {
					var length = conversation.messages.length;
					var lastMessage = conversation.messages[length - 1];

					if (length > 0) {
						var date = new Date(lastMessage.date).getTime();
					}

					conversation.members[0].lastUpdated = date || Date.now();
					$scope.activeConvs.push(conversation.members[0]);
				});

				$scope.groups.forEach(function (group) {
					var length = group.messages.length;
					var lastMessage = group.messages[length - 1];

					if (length > 0) {
						var date = new Date(lastMessage.date).getTime();
					}

					group.lastUpdated = date || Date.now();
					$scope.activeConvs.push(group);
				});

				$scope.convSelected = function (item) {
					item.notification = false;
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
					var conversation = _.find($scope.activeConvs, {
						_id: item._id
					});

					if (conversation) {
						var index = $scope.activeConvs.indexOf(target);
						// $scope.activeConvs[index] = item;
						//instead of replacing copy properties to avoid loosing the object's reference
						var target = $scope.activeConvs[index];

						for (var prop in target) {
							target[prop] = item[prop];
						}
					}
				});

				$scope.$on('convList:select', function (event) {
					if ($scope.activeConvs.length > 0) {
						$scope.convSelected($scope.activeConvs[0]);
					}
				});

				//trigger default state
				if ($scope.activeConvs.length > 0) {
					var lastUpdated = Math.max.apply(Math, $scope.activeConvs.map(function (conversation) {
						return conversation.lastUpdated;
					}));

					var target = _.find($scope.activeConvs, {
						lastUpdated: lastUpdated
					});
					setTimeout($scope.convSelected, 0, target);
				}

			}
		};
	});
