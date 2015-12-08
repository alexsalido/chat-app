'use strict';

var autoFocus = function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			if (attrs.autoFocus == 0) {
				element.find('input').focus();
			}
		}
	};
};

angular.module('chatApp').directive("autoFocus", autoFocus);
