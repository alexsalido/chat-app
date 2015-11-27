'use strict';

angular.module('chatApp')
	.controller('LoginCtrl', function ($scope, Auth, $location, $window, $mdDialog) {
		$scope.user = {};
		$scope.errors = {};

		console.log($scope);
		$scope.formFields = {
			email: {
				label: 'Email',
				type: 'email',
			},

			password: {
				label: 'Password',
				type: 'password'
			}
		};

		$scope.login = function (form) {
			$scope.submitted = true;

			if (form.$valid) {
				Auth.login({
						email: $scope.user.email,
						password: $scope.user.password
					})
					.then(function () {
						$mdDialog.cancel();
						// Logged in, redirect to home
						$location.path('/dashboard');
					})
					.catch(function (err) {
						form[err.field].$setValidity("mongoose", false);
						$scope.errors.other = err.message;
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

		$scope.loginOauth = function (provider) {
			$window.location.href = '/auth/' + provider;
		};

		$scope.cancel = function () {
			$mdDialog.cancel();
		};

		$scope.showSignup = function (ev) {
			$mdDialog.show({
				controller: 'SignupCtrl',
				templateUrl: 'app/account/signup/signup.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			});
		};
	});
