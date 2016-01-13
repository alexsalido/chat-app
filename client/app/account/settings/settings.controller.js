'use strict';

angular.module('chatApp')
	.controller('SettingsCtrl', function ($scope, User, Auth, type, $mdDialog, $mdToast) {
		$scope.errors = {};

		$scope.type = type;

		$scope.saveChanges = function (form, type) {
			$scope.submitted = true;
			if (form.$valid) {
				if (type == 'password') {
					Auth.changePassword($scope.user.current, $scope.user.password)
						.then(function (res) {
							$mdToast.show($mdToast.simple().position('top right').textContent(res.message).action('OK'));
							$scope.cancel();
						})
						.catch(function () {
							if (err.status === 500) {
								$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
							} else {
								form.current.$setValidity('mongoose', false);
								$scope.errors.other = 'Incorrect password';
								$scope.message = '';
							}
						});
				} else if (type == 'email') {
					Auth.changeEmail($scope.user.current, $scope.user.email)
						.then(function (res) {
							$mdToast.show($mdToast.simple().position('top right').textContent(res.message).action('OK'));
							$scope.cancel();
						})
						.catch(function (err) {
							if (err.status === 422) {
								$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
							} else {
								form.current.$setValidity('mongoose', false);
								$scope.errors.other = 'Incorrect password';
								$scope.message = '';
							}
						});
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
