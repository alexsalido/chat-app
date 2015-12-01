'use strict';

angular.module('chatApp')
	.controller('DashboardCtrl', function ($scope, $location, Auth) {

		$scope.logout = function () {
			Auth.logout();
			$location.path('/');
		};

		$scope.openChat = function (_id, ev) {
			for (var i = 0; i < $scope.chats.length; i++) {
				console.log($scope.chats[i]);
				if ($scope.chats[i]._id === _id) {
					$scope.chats[i].newMessage = false;
					$scope.activeChat = $scope.chats[i];
					$scope.apply();
				}
			}
		};

		//Fake chats
		$scope.chats = [{
			_id: 1,
			name: 'Janet Perkins',
			img: undefined,
			newMessage: false,
			active: false,
		}, {
			_id: 2,
			name: 'Mary Johnson',
			img: undefined,
			newMessage: true,
			active: false,
		}, {
			_id: 3,
			name: 'Peter Carlsson',
			img: '/assets/images/kitty.jpeg',
			newMessage: false,
			active: false,
		}];

		$scope.activeChat = $scope.chats[0];

		$scope.$watch('activeChat', function (newVal, oldVal) {
			oldVal.active = false;
			newVal.active = true;
			console.log('here');
		})

	});
