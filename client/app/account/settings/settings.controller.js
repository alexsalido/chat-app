'use strict';

angular.module('chatApp')
	.controller('SettingsCtrl', function ($scope, User, Auth, type, socket, $mdDialog, $mdToast) {
		$scope.errors = {};

		$scope.type = type;

		$scope.saveChanges = function (form, type) {
			$scope.submitted = true;
			if (form.$valid) {
				if (type === 'password') {
					Auth.changePassword($scope.currentPassword, $scope.new)
						.then(function (res) {
							$mdToast.show($mdToast.simple().position('top right').textContent(res.message).action('OK'));
							$scope.cancel();
						})
						.catch(function (err) {
							if (err.status === 403) {
								form.currentPassword.$setValidity('mongoose', false);
								$scope.errors.other = 'Incorrect password';
								$scope.message = '';
							} else if (err.status === 500) {
								$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
							} else if (err.status === 422) {
								err = err.data;
								// Update validity of form fields that match the mongoose errors
								angular.forEach(err.errors, function (error, field) {
									form[field].$setValidity('mongoose', false);
									$scope.errors[field] = error.message;
								});
							}
						});
				} else if (type === 'email') {
					Auth.changeEmail($scope.currentPassword, $scope.new)
						.then(function (res) {
							$mdToast.show($mdToast.simple().position('top right').textContent(res.message).action('OK'));
							socket.userUpdate('email');
							$scope.cancel();
							Auth.getCurrentUser().email = $scope.new; //Update email in local copy of user
						})
						.catch(function (err) {
							if (err.status === 403) {
								form.currentPassword.$setValidity('mongoose', false);
								$scope.errors.other = 'Incorrect password';
								$scope.message = '';
							} else if (err.status === 500) {
								$mdToast.show($mdToast.simple().position('top right').textContent(err.data).action('OK'));
							} else if (err.status === 422) {
								err = err.data;
								// Update validity of form fields that match the mongoose errors
								angular.forEach(err.errors, function (error, field) {
									form[field].$setValidity('mongoose', false);
									$scope.errors[field] = error.message;
								});
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
