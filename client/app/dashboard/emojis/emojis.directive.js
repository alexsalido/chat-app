'use strict';

angular.module('chatApp')
	.directive('emojis', ['emojify', function (emojify) {
		return {
			restrict: 'EA',
			link: function (scope, element, attrs) {
				for(var i = 0; i < 100; i++) {
					element.append(':' + emojify.emojiNames[i] + ': ');
				}
				emojify.run(element[0]);
			}
		};
	}]);
