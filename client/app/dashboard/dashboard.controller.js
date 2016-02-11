'use strict';

angular.module('chatApp')
	.controller('DashboardCtrl', function ($scope, $location, Auth, Group, User, $mdSidenav, $mdDialog, $mdBottomSheet, $mdToast, socket) {
		$scope.me = Auth.getCurrentUser();

		$scope.errors = {};
		$scope.contactListSearch = '';
		$scope.chatListSearch = '';

		$scope.createGroup = function (form) {
			$scope.submitted = true;
			if (form.$valid) {
				Group.save({
					name: $scope.newGroupName,
					admin: $scope.me._id,
					members: [$scope.me._id]
				}, function (res) {
					$mdToast.show($mdToast.simple().position('top right').textContent(res.message).action('OK'));
					$mdDialog.cancel();
					$scope.submitted = false;
					$scope.newGroupName = '';
					socket.addedParticipants(res.group._id, [$scope.me._id]);
					$scope.$broadcast('convList:newGroup');
				}, function (err) {
					$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
				});
			}
		};

		$scope.sendFriendRequest = function (form) {
			$scope.submitted = true;
			if (form.$valid) {
				Auth.isRegistered($scope.newContactEmail)
					.then(function (data) {
						Auth.sendFriendRequest(data._id).then(function (res) {
							$mdToast.show($mdToast.simple().position('top right').textContent(res.message).action('OK'));
							socket.friendRequest(data._id, $scope.me._id);
							$mdDialog.cancel();
							$scope.submitted = false;
							$scope.newContactEmail = '';
						}).catch(function (err) {
							$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
						});
					})
					.catch(function (err) {
						form[err.field].$setValidity('mongoose', false);
						$scope.errors.other = err.message;
					});
			}
		};

		$scope.showSettingsDialog = function (type, ev) {
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

		$scope.showNewGroupDialog = function (ev) {
			$mdDialog.show({
				scope: $scope,
				preserveScope: true,
				templateUrl: 'app/dashboard/views/newgroup.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			});
		};

		$scope.showNewContactDialog = function (ev) {
			$mdDialog.show({
				scope: $scope,
				preserveScope: true,
				templateUrl: 'app/dashboard/views/newcontact.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			});
		};

		$scope.toggleSidenav = function (id) {
			$mdSidenav(id).toggle();
		};

		$scope.cancel = function () {
			$mdDialog.cancel();
			$scope.submitted = false;
		};


		$scope.logout = function () {
			socket.disconnect();
			Auth.logout();
			$location.path('/');
		};

		//|**	 **|//
		//| Events |//
		//|**	 **|//

		$scope.$on('contactListUpdate', function () {});

		$scope.$on('contactList:selected', function (event, user) {
			$scope.$broadcast('convList:new', user);
		});

		$scope.$on('contactList:updated', function (event, user) {
			$scope.$broadcast('convWindow:update', user);
			$scope.$broadcast('convList:update', user);
		});

		$scope.$on('convList:deleted', function (event, conversation) {
			$scope.$broadcast('convWindow:deleted', conversation);
		});

		$scope.$on('convSelected', function (event, user, conversation) {
			$scope.$broadcast('openConv', user, conversation);
		});

		$scope.$on('convWindow:change', function (event) {
			$scope.$broadcast('convList:select');
		});
	});
