'use strict';

angular.module('chatApp')
	.provider('emojify', function () {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return {
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
