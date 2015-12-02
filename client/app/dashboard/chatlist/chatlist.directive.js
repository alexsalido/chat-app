'use strict';

angular.module('chatApp')
	.directive('chatList', function () {
		return {
			templateUrl: 'app/dashboard/chatlist/chatlist.html',
			restrict: 'E',
			replace: true,
			link: function (scope, element, attrs) {}
		};
	});
