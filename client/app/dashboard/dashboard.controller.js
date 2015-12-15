'use strict';

angular.module('chatApp')
	.controller('DashboardCtrl', function ($scope, $location, Auth, $mdSidenav, $mdDialog, $mdBottomSheet, $mdToast) {

		$scope.searchbox = 'p';

		$scope.user = {
			status: 'Force choking my commanders',
			img: '/assets/images/profile_1.jpg',
		};

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

		$scope.addMember = function () {};
		//Fake contacts
		$scope.contacts = [{
			_id: 1,
			name: 'Joe Perkins',
			username: 'theperks',
			email: 'perks@foobar.com',
			img: 'assets/images/profile_2.jpg',
			newMessage: false,
			active: false,
			online: true,
			status: 'Shooting some Jedi',
			online: true
		}, {
			_id: 2,
			name: 'Mark Johnson',
			username: 'marksman',
			email: 'mark@foobar.com',
			img: '/assets/images/profile_3.jpg',
			newMessage: true,
			active: false,
			online: true,
			status: 'Just standing there',
			online: true
		}, {
			_id: 3,
			name: 'Peter Carlson',
			username: 'pita',
			email: 'pita@foobar.com',
			img: '/assets/images/profile_4.jpg',
			newMessage: false,
			active: false,
			online: true,
			status: 'Speaking with Darth Vader',
			online: false
		}];

		//Fake chats
		$scope.chats = [{
			_id: 1,
			user: $scope.contacts[0],
			newMessage: false,
			active: false,
			online: true,
			status: 'Shooting some Jedi'
		}, {
			_id: 2,
			user: $scope.contacts[1],
			newMessage: true,
			active: false,
			online: true,
			status: 'Just standing there'
		}, {
			_id: 3,
			user: $scope.contacts[2],
			newMessage: false,
			active: false,
			online: true,
			status: 'Speaking with Darth Vader'
		}, {
			_id: 4,
			name: 'Stormtroopers',
			members: [$scope.contacts[0], $scope.contacts[2]],
			group: true,
			img: '/assets/images/group_1.jpg',
			newMessage: true,
			active: false
		}];

		$scope.activeChat = $scope.chats[0];

		$scope.$watch('activeChat', function (newVal, oldVal) {
			oldVal.active = false;
			newVal.active = true;
		});


		$scope.pending = [{
			name: 'Chewbacca',
			email: 'chewie@foobar.com',
			img: '/assets/images/profile_5.jpg',
		}]

		$scope.handleFriendRequest = function (email, action) {
			console.log(email, action);
		}

		$scope.deleteChat = function (sidenav) {
			if (sidenav) $mdSidenav(sidenav).close();
			var _id = $scope.activeChat._id;
			console.log(_id);
			for (var i = 0; i < $scope.chats.length; i++) {
				if ($scope.chats[i]._id === _id) {
					$scope.activeChat.active = true;
					$scope.chats.splice(i, 1);
					$scope.activeChat = $scope.chats[i + 1];
				}
			}
		};

		$scope.showSettings = function (type, ev) {
			$mdDialog.show({
				controller: 'SettingsCtrl',
				templateUrl: 'app/account/settings/settings.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				locals: {
					type: type
				}
			});
		};

		$scope.showScribble = function (ev) {
			$mdDialog.show({
				scope: $scope,
				preserveScope: true,
				templateUrl: 'app/dashboard/views/scribble.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
			});
		};

		$scope.newGroup = function (ev) {
			$mdDialog.show({
				scope: $scope,
				preserveScope: true,
				templateUrl: 'app/dashboard/views/newgroup.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			});
		};

		$scope.cancel = function () {
			$mdDialog.cancel();
			$scope.submitted = false;
		};

		$scope.createGroup = function (form) {
			$scope.submitted = true;
			if (form.$valid) {
				console.log("group created");
				$scope.chats.push({
					_id: 5,
					name: $scope.newgroup.name,
					members: [],
					group: true,
					img: '/assets/images/group_1.jpg',
					newMessage: false,
					active: false
				});
				$scope.cancel();
				$scope.newgroup = {};
			}
		};


		$scope.showEmojis = function (ev) {
			var element = document.getElementById('chat-box');
			$mdBottomSheet.show({
				templateUrl: 'app/dashboard/views/emojis.html',
				parent: element,
				scope: $scope,
				preserveScope: true,
				clickOutsideToClose: true,
				targetEvent: ev
			});
		};

		$scope.newContact = function (ev) {
			$mdDialog.show({
				scope: $scope,
				preserveScope: true,
				templateUrl: 'app/dashboard/views/newcontact.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			});
		};
	});
