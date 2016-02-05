'use strict';

angular.module('chatApp')
	.directive('chatInfo', function (Auth, Group, socket, FileUploader, $cookieStore, $mdDialog, $mdSidenav, $mdToast) {
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

				$scope.notAContact = function (user) {
					var contact = _.find($scope.me.contacts, {
						_id: user._id
					});
					return !!!contact;
				};

				$scope.sendFriendRequest = function (user) {
					Auth.isRegistered(user.email)
						.then(function (data) {
							Auth.sendFriendRequest(data._id).then(function (res) {
								$mdToast.show($mdToast.simple().position('top right').textContent(res.message).action('OK'));
								socket.friendRequest(data._id, $scope.me._id);
							}).catch(function (err) {
								$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
							});
						});
				};

				//|**	             **|//
				//| Change Group Image |//
				//|**	   	         **|//

				var imageOverlay = angular.element(document.getElementById('group-image-overlay'));
				var progressOverlay = angular.element(document.getElementById('group-progress-overlay'));
				var groupUpload = document.getElementById('group-upload');

				$scope.uploader = new FileUploader({
					// url: 'api/image/' + $scope.activeChat._id + '/group',
					method: 'PUT',
					withCredentials: 'true',
					headers: {
						'Authorization': 'Bearer ' + $cookieStore.get('token')
					},
					autoUpload: true,
					removeAfterUpload: true,
					filters: [{
						name: 'checkSize',
						fn: function (item) {
							if (item.size > (5 * 1024 * 1024)) {
								$mdToast.show($mdToast.simple().position('top right').textContent('Sorry, group images cannot be greater than 5Mb.'));
								return false;
							}
							return true;
						}
					}]
				});

				$scope.uploader.onBeforeUploadItem = function () {
					imageOverlay.toggleClass('display-none');
					progressOverlay.toggleClass('display-none');
				};

				$scope.uploader.onErrorItem = function () {
					imageOverlay.toggleClass('display-none');
					progressOverlay.toggleClass('display-none');
					$mdToast.show($mdToast.simple().position('top right').textContent('Oh no! There was a problem updating your profile picture. Please try again.').action('OK'));
					groupUpload.value = '';
				};

				$scope.uploader.onSuccessItem = function (item, response) {
					$scope.activeChat.img = response.url + '?Date=' + Date.now();
					var img = new Image();
					img.src = $scope.activeChat.img;
					img.onload = function () {
						imageOverlay.toggleClass('display-none');
						progressOverlay.toggleClass('display-none');
						$mdToast.show($mdToast.simple().position('top right').textContent('Your profile image was changed successfully.').action('OK'));
						socket.groupUpdate('img', $scope.activeChat._id);
					};
				};

				$scope.changeGroupImage = function () {
					$scope.uploader.url = 'api/image/' + $scope.activeChat._id + '/group';
					groupUpload.click();
				};

				//|**	   **|//
				//| Watchers |//
				//|**	   **|//

				$scope.$watch(function () {
					return $mdSidenav('contact-info').isOpen();
				}, function () {
					if ($scope.groupNameForm.$valid && $scope.groupNameForm.$dirty && $scope.activeChat.name !== $scope.dummyName) {
						var current = $scope.activeChat;
						Group.update({
							id: current._id
						}, {
							name: $scope.dummyName
						}, function () { //success
							current.name = $scope.dummyName;
							socket.groupUpdate('name', current._id);
						}, function () { //error
							$mdToast.show($mdToast.simple().position('top right').textContent('There was an error updating the group\'s name. Please try again.').action('OK'));
							$scope.dummyName = current.name;
						});
					}
				});

				$scope.$watch('activeChat', function (newVal) {
					if (newVal) {
						$scope.dummyName = newVal.name;

					}
				}, true);

				//|**	              **|//
				//| Adding participants |//
				//|**	   	          **|//

				$scope.addParticipants = function () {
					var current = $scope.activeChat;
					var newParticipants = [];

					$scope.selected.forEach(function (value) {
						newParticipants.push(value._id);
					});

					Group.addParticipants({
						id: current._id
					}, {
						users: newParticipants
					}, function (res) { //success
						socket.addedParticipants(current._id, newParticipants);
						current.members = current.members.concat($scope.selected);
						$scope.close();
						$mdToast.show($mdToast.simple().position('top right').textContent(res.message).action('OK'));
					}, function (err) { //error
						$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
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

				$scope.addToChip = function (user) {
					$scope.selected.push(user);
				};

				$scope.notAMember = function (user) {
					var member = _.find($scope.activeChat.members, {
						_id: user._id
					});
					return !!!member;
				};

				$scope.showContactList = function (event) {
					$scope.selected = [];
					$scope.contactsClone = $scope.contacts.slice();

					//add lowercase names to contacts
					(function (contacts) {
						contacts.forEach(function (element) {
							element._lowername = element.name.toLowerCase();
						});
					})($scope.contactsClone);

					$mdDialog.show({
						templateUrl: 'app/dashboard/views/addparticipant.html',
						scope: $scope,
						preserveScope: true,
						parent: angular.element(document.body),
						targetEvent: event,
						clickOutsideToClose: true
					});
				};

				function createFilterFor(query) {
					var lowercaseQuery = angular.lowercase(query);
					return function filterFn(contact) {
						return (contact._lowername.indexOf(lowercaseQuery) !== -1);
					};
				}
			}
		};
	});
