'use strict';

angular.module('chatApp')
	.controller('SignupCtrl', function ($scope, Auth, $location, $window, $mdDialog) {
		$scope.user = {
			firstname: 'Alejandro',
			lastname: 'Salido',
			email: 'alexsalidoa@gmail.com',
			username: 'alexsalido',
			password: '123456',
		};
		$scope.errors = {};

		//Signup form object schema
		$scope.formFields = {
			firstname: {
				label: 'First Name',
				type: 'text'
				//pattern: /^[A-Z\-']+$/i
			},
			lastname: {
				label: 'Last Name',
				type: 'text',

			},
			username: {
				label: 'Username',
				type: 'text',
				maxLength: 12,
				minLength: 4
				//pattern: /^[A-Z0-9]+[\.|_]?[A-Z0-9]*$/i
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
				minLength: 6
				//pattern: /^[A-Z0-9]+$/i
			}
		}

		$scope.register = function (form) {
			$scope.submitted = true;

			console.log("here");

			if (form.$valid) {
				Auth.createUser({
						firstname: $scope.user.firstname,
						lastname: $scope.user.lastname,
						username: $scope.user.username,
						email: $scope.user.email,
						password: $scope.user.password
					})
					.then(function () {
						// Account created, redirect to home
						$location.path('/');
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
			}
		};

		$scope.loginOauth = function (provider) {
			$window.location.href = '/auth/' + provider;
		};

		$scope.cancel = function () {
			$mdDialog.cancel();
			$scope.user = {};
		}
	});
