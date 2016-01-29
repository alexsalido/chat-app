'use strict';

angular.module('chatApp')
	.directive('chatInfo', function (Auth, Group, socket, $mdDialog, $mdSidenav, $mdToast) {
		return {
			templateUrl: 'app/dashboard/chatinfo/chatinfo.html',
			restrict: 'EA',
			replace: true,
			scope: {
				activeChat: '=src',
				deleteChat: '&delete',
				kick: '&kick'
			},
			controller: function ($scope) {
				$scope.me = Auth.getCurrentUser();
				$scope.contacts = $scope.me.contacts;

				if ($scope.activeChat) {
					$scope.dummyGroupName = $scope.activeChat.name;
				}

				$scope.$watch(function () {
					return $mdSidenav('contact-info').isOpen();
				}, function () {
					if ($scope.groupNameForm.$valid && $scope.activeChat.name != $scope.dummyGroupName && $scope.activeChat.members) {
						var current = $scope.activeChat;
						Group.update({
							id: current._id
						}, {
							name: current.name
						}, function () { //success
							$scope.dummyGroupName = current.name;
						}, function () { //error
							$mdToast.show($mdToast.simple().position('top right').textContent('There was an error updating the group\'s name. Please try again.').action('OK'));
							current.name = $scope.dummyGroupName;
						});
					}
				});

				//**	             **//
				// Adding participants //
				//**	   	         **//

				$scope.selected = [];
				$scope.contactsClone = $scope.contacts.slice();

				$scope.addParticipants = function () {
					var current = $scope.activeChat;
					var newParticipants = [];

					$scope.selected.forEach(function (value) {
						newParticipants.push(value._id);
					});

					Group.update({
						id: current._id
					}, {
						members: current.members.concat($scope.selected)
					}, function (group) { //success
						socket.addedParticipants(group._id, newParticipants);
						current.members = current.members.concat($scope.selected);
						$scope.close();
					}, function () { //error
						console.log('error');
					});
				};

				$scope.querySearch = function (query) {
					var results = query ?
						$scope.contactsClone.filter(createFilterFor(query)) : [];
					return results;
				};

				$scope.close = function () {
					$mdDialog.cancel();
					$scope.selected = [];
				};

				$scope.showContactList = function (ev) {
					$mdDialog.show({
						templateUrl: 'app/dashboard/views/addparticipant.html',
						scope: $scope,
						preserveScope: true,
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true
					});
				};

				function createFilterFor(query) {
					var lowercaseQuery = angular.lowercase(query);
					return function filterFn(contact) {
						return (contact._lowername.indexOf(lowercaseQuery) !== -1);
					};
				}

				//add lowercase names to contacts
				(function (contacts) {
					contacts.forEach(function (element) {
						element._lowername = element.name.toLowerCase();
					});
				})($scope.contactsClone);
			}
		};
	});
