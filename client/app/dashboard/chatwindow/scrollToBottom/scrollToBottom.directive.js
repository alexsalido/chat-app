'use strict';

angular.module('chatApp')
	.directive('scrollToBottom', function () {
		return {
			scope: {
				scrollToBottom: '='
			},
			link: function (scope, element) {
				scope.$watchCollection('scrollToBottom', function (newValue) {
					if (newValue) {
						element[0].scrollTop = element[0].scrollHeight;
					} else {
						setTimeout(function () {
							element[0].scrollTop = element[0].scrollHeight;
						}, 0);
					}
				});
			}
		};
	});
