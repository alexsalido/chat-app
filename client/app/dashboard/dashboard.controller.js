'use strict';

angular.module('chatApp')
	.controller('DashboardCtrl', function ($scope, $location, Auth, $mdSidenav) {

		$scope.user = {
			img: '/assets/images/profile_1.jpg',
		}

		$scope.logout = function () {
			Auth.logout();
			$location.path('/');
		};

		$scope.openChat = function (_id, ev) {
			for (var i = 0; i < $scope.chats.length; i++) {
				if ($scope.chats[i]._id === _id) {
					$scope.chats[i].newMessage = false;
					$scope.activeChat = $scope.chats[i];
				}
			}
		};

		//Fake chats
		$scope.chats = [{
			_id: 1,
			name: 'Joe Perkins',
			username: 'theperks',
			email: 'perks@foobar.com',
			img: 'assets/images/profile_2.jpg',
			newMessage: false,
			active: false,
		}, {
			_id: 2,
			name: 'Mark Johnson',
			username: 'marksman',
			email: 'mark@foobar.com',
			img: '/assets/images/profile_3.jpg',
			newMessage: true,
			active: false,
		}, {
			_id: 3,
			name: 'Peter Carlson',
			username: 'pita',
			email: 'pita@foobar.com',
			img: '/assets/images/profile_4.jpg',
			newMessage: false,
			active: false,
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
		, {
			_id: 4,
			name: 'Stormtroopers',
			username: 'Stormtroopers',
			users: ['Joe Perkins', 'Mark Johnson','Peter Carlson'],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}
	];

		$scope.activeChat = $scope.chats[0];

		$scope.$watch('activeChat', function (newVal, oldVal) {
			oldVal.active = false;
			newVal.active = true;
		})

		$scope.deleteChat = function (sidenav) {
			if (sidenav) $mdSidenav(sidenav).close()
			var _id = $scope.activeChat._id;
			for (var i = 0; i < $scope.chats.length; i++) {
				if ($scope.chats[i]._id === _id) {
					$scope.activeChat = $scope.chats[i + 1];
					$scope.activeChat.active = true;
					$scope.chats.splice(i, 1);
				}
			}
		}
	});
