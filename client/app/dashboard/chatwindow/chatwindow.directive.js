'use strict';

angular.module('chatApp')
	.directive('chatWindow', function ($mdSidenav) {
		return {
			templateUrl: 'app/dashboard/chatwindow/chatwindow.html',
			restrict: 'E',
			replace: true,
			controller: function ($scope) {

				$scope.activeTabIndex = 0;

				$scope.toggleContactInfo = function () {
					$mdSidenav('contact-info').toggle()
				};

				$scope.selected = [$scope.contacts[0]];
			},
			link: function (scope, element, attrs) {}
		}
	});
