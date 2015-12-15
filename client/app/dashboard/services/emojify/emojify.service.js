'use strict';

angular.module('chatApp')
	.provider('emojify', function () {
		// AngularJS will instantiate a singleton by calling "new" on this function
		emojify.emojis = {};
		emojify.DOMLoaded = {};

		return {
			setEmojis: function (_emojis) {
				emojify.emojis = _emojis;
			},

			setConfig: function (dir) {
				emojify.setConfig({
					img_dir: dir
				});
			},
			$get: function () {
				return emojify;
			}
		};
	});
