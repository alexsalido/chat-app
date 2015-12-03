'use strict';

angular.module('chatApp')
	.controller('SettingsCtrl', function ($scope, User, Auth, type, $mdDialog) {
		$scope.errors = {};

		$scope.type = type;

		$scope.saveChanges = function (form, type) {
			console.log($scope);
			$scope.submitted = true;
			if (form.$valid) {
				if (type == 'password') {
					Auth.changePassword($scope.user.current, $scope.user.password)
					.then(function () {
						//$scope.message = 'Password successfully changed.';
						$scope.cancel();
					})
					.catch(function () {
						form.current.$setValidity('mongoose', false);
						$scope.errors.other = 'Incorrect password';
						$scope.message = '';
					});
				} else if (type == 'email') {
					console.log('implement email change');
					$scope.cancel();
				}
			} else {
				// Update validity of form fields
				angular.forEach(form.$error, function (errors, type) {
					for (var i = 0; i < errors.length; i++) {
						form[errors[i].$name].$setValidity(type, false);
						errors[i].$touched = true;
					}
				});
			}
		};

		$scope.cancel = function () {
			$mdDialog.cancel();
			$scope.submitted = false;
		};
	});
