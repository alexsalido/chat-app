'use strict';

angular.module('chatApp')
	.controller('SignupCtrl', function ($scope, Auth, showLogin, $location, $window, $mdDialog) {
		$scope.user = {};
		$scope.errors = {};

		//Signup form object schema
		$scope.formFields = {
			name: {
				label: 'Name',
				type: 'text',
				pattern: /^[A-Z\-\s']+$/i
			},
			email: {
				label: 'Email',
				type: 'email',
				confirmation: true
			},
			password: {
				label: 'Password',
				type: 'password',
				confirmation: true,
				maxLength: 12,
				minLength: 6,
				pattern: /^[A-Z0-9]+$/i
			}
		};

		$scope.register = function (form) {
			$scope.submitted = true;

			if (form.$valid) {
				Auth.createUser({
						name: $scope.user.name,
						email: $scope.user.email,
						password: $scope.user.password
					})
					.then(function () {
						// Account created show login
						// $location.path('/');
						$scope.showLogin();
					})
					.catch(function (err) {
						err = err.data;
						$scope.errors = {};

						// Update validity of form fields that match the mongoose errors
						angular.forEach(err.errors, function (error, field) {
							form[field].$setValidity('mongoose', false);
							$scope.errors[field] = error.message;
						});
					});
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

		$scope.showLogin = showLogin;

		$scope.loginOauth = function (provider) {
			$window.location.href = '/auth/' + provider;
		};

		$scope.cancel = function () {
			$mdDialog.cancel();
		};
	});
