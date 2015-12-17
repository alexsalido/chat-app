'use strict';

var autoFocus = function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			if (attrs.autoFocus == 0) {
				setTimeout(function () {
					element.find('input').focus();
				}, 0);
			}
		}
	};
};

angular.module('chatApp').directive("autoFocus", autoFocus);
