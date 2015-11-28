'use strict';

angular.module('chatApp')
	.controller('DashboardCtrl', function ($scope, $location, Auth) {
		$scope.message = 'Hello';

		$scope.logout = function () {
			Auth.logout();
			$location.path('/');
		};

		//Fake chats
		$scope.chats = [{
			name: 'Janet Perkins',
			img: '/assets/svg/face.svg',
			newMessage: true
		}, {
			name: 'Mary Johnson',
			img: '/assets/svg/face.svg',
			newMessage: false
		}, {
			name: 'Peter Carlsson',
			img: '/assets/svg/face.svg',
			newMessage: false
		}, {
			name: 'Janet Perkins',
			img: '/assets/svg/face.svg',
			newMessage: true
		}, {
			name: 'Mary Johnson',
			img: '/assets/svg/face.svg',
			newMessage: false
		}, {
			name: 'Peter Carlsson',
			img: '/assets/svg/face.svg',
			newMessage: false
		}, {
			name: 'Janet Perkins',
			img: '/assets/svg/face.svg',
			newMessage: true
		}, {
			name: 'Mary Johnson',
			img: '/assets/svg/face.svg',
			newMessage: false
		}];
	});
