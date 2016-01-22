'use strict';

angular.module('chatApp')
	.directive('message', function () {
		return {
			restrict: 'E',
			link: function (scope, element, attrs) {
				var sender = attrs.sender;
				var me = attrs.receiver;
				if (sender === me) {
					element.addClass('me');
				} else {
					element.addClass('them');
				}
			}
		};
	});
