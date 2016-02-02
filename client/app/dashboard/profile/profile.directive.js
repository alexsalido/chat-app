'use strict';

angular.module('chatApp')
	.directive('profile', function ($mdSidenav, Auth, FileUploader, $cookieStore, $mdToast, socket) {
		return {
			templateUrl: 'app/dashboard/profile/profile.html',
			restrict: 'E',
			scope: {},
			controller: function ($scope) {

				$scope.me = Auth.getCurrentUser();

				$scope.dummyStatus = $scope.me.status;

				$scope.uploader = new FileUploader({
					url: 'api/image/' + $scope.me._id,
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
								$mdToast.show($mdToast.simple().position('top right').textContent('Sorry, profile images cannot be greater than 5Mb.'));
								return false;
							}
							return true;
						}
					}]
				});

				var imageOverlay = angular.element(document.getElementById('profile-image-overlay'));
				var progressOverlay = angular.element(document.getElementById('profile-progress-overlay'));
				var profileUpload = document.getElementById('profile-upload');

				$scope.uploader.onBeforeUploadItem = function () {
					imageOverlay.toggleClass('display-none');
					progressOverlay.toggleClass('display-none');
				};

				$scope.uploader.onErrorItem = function () {
					imageOverlay.toggleClass('display-none');
					progressOverlay.toggleClass('display-none');
					$mdToast.show($mdToast.simple().position('top right').textContent('Oh no! There was a problem updating your profile picture. Please try again.').action('OK'));
					profileUpload.value = '';
				};

				$scope.uploader.onSuccessItem = function (item, response) {
					$scope.me.img = response.url + '?Date=' + Date.now();
					var img = new Image();
					img.src = $scope.me.img;
					img.onload = function () {
						imageOverlay.toggleClass('display-none');
						progressOverlay.toggleClass('display-none');
						$mdToast.show($mdToast.simple().position('top right').textContent('Your profile image was changed successfully.').action('OK'));
						socket.userUpdate('img');
					};
				};

				$scope.toggleProfileInfo = function () {
					$mdSidenav('profile-info').close();
				};

				$scope.changeProfileImage = function () {
					profileUpload.click();
				};

				$scope.$watch(function () {
					return $mdSidenav('profile-info').isOpen();
				}, function () {
					if ($scope.statusForm.$valid && $scope.me.status !== $scope.dummyStatus) {
						Auth.changeStatus($scope.dummyStatus).then(function () {
							socket.userUpdate('status');
						}).catch(function (err) {
							$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
						});
						$scope.me.status = $scope.dummyStatus;
					}
				});

				$scope.$watch('me.email', function (newVals) {
					if (newVals) {
						$scope.dummyEmail = newVals;
					}
				});
			}
		};
	});
