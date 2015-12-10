'use strict';

angular.module('chatApp')
	.directive('contactList', function ($mdSidenav) {
		return {
			templateUrl: 'app/dashboard/contactlist/contactlist.html',
			restrict: 'E',
			replace: true,
			controller: function ($scope, $element, $attrs, $mdSidenav, $mdDialog) {

				$scope.requests = $attrs.requests || false;

				$scope.toggleContactList = function () {
					$mdSidenav('contact-list').toggle()
				};
			},
			link: function (scope, element, attrs) {
				console.log(attrs.requests);
				scope.requests = attrs.requests || false;
			}
		};
	});
