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

				$scope.chats = $scope.me.conversations.concat($scope.me.groups);
				socket.syncChats($scope.chats);

				// $scope.$on('openChat', function (ev, userId) {
				// 	// var index = _.find($scope.chats, function (chat, index) {});
				//
				// // 	Conversation.save({
				// // 		member: userId
				// // 	}, function (res) {}, function (err) {});
				// // });

			},
			link: function (scope, element, attrs) {}
		};
	});
