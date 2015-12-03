'use strict';

angular.module('chatApp')
	.directive('chatWindow', function ($mdSidenav) {
		return {
			templateUrl: 'app/dashboard/chatwindow/chatwindow.html',
			restrict: 'E',
			replace: true,
			controller: function ($scope) {

				$scope.toggleContactInfo = function () {
					$mdSidenav('contact-info').toggle()
				}
			},
			link: function (scope, element, attrs) {}
		}
	});
