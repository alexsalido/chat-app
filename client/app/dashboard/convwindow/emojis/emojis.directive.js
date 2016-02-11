'use strict';

angular.module('chatApp')
	.directive('emojis', ['emojify', function (emojify) {
		return {
			restrict: 'EA',
			link: function (scope, element, attrs) {
				var category = attrs.category;
				if (emojify.DOMLoaded[category]) element.append(emojify.DOMLoaded[category]);
				else {
					if (category) {
						var emojis = emojify.emojis[category];
						for (var i = 0; i < emojis.length; i++) {
							element.append(emojis[i] + ' ')
						}
					}
					emojify.run(element[0]);
					emojify.DOMLoaded[category] = element.children();
				}

			}
		};
	}]);
