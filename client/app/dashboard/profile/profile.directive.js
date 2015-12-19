'use strict';

angular.module('chatApp')
	.directive('profile', function (imageUpload, $mdSidenav, Auth) {
		return {
			templateUrl: 'app/dashboard/profile/profile.html',
			restrict: 'E',
			scope: {},
			controller: function ($scope) {

				$scope.me = Auth.getCurrentUser();

				$scope.dummyStatus = $scope.me.status;

				$scope.input = document.createElement('input');
				$scope.input.type = 'file';

				$scope.toggleProfileInfo = function () {
					$mdSidenav('profile-info').close();
				};

				$scope.changeProfileImage = function () {
					$scope.input.click();
				};

				$scope.input.onchange = function () {
					alert($scope.input.value);
				}

				// $scope.$watch(function () {
				// 	return $scope.input.value;
				// }, function (newVals) {
				// 	if (newVals) alert(newVals);
				// });

				$scope.$watch('dummyStatus', function (newVals) {
					if ($scope.statusForm.$valid) {
						$scope.me.status = newVals;
					}
				});

				$scope.$watch(function () {
					return $mdSidenav('profile-info').isOpen();
				}, function () {
					$scope.dummyStatus = $scope.me.status;
				});
			}
		};
	});
