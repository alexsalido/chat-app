'use strict';

angular.module('chatApp')
	.directive('contactList', function ($mdSidenav) {
		return {
			templateUrl: 'app/dashboard/contactlist/contactlist.html',
			restrict: 'E',
			replace: true,
			controller: function ($scope) {

				$scope.toggleContactList = function () {
					console.log("here");
					$mdSidenav('contact-list').toggle()
				};

			},
			link: function (scope, element, attrs) {}
		};
	});
