'use strict';

angular.module('chatApp')
	.provider('imageUpload', function () {
		// AngularJS will instantiate a singleton by calling "new" on this function
		var url;
		return {
			setUrl: function (_url) {
				url = _url;
			},
			$get: function ($http) {
				return function (file) {
					var formData = new FormData();
					formData.append('file', file);
					$http.post(url, formData, {

					}).then(function success() {}, function error() {});
				};
			}
		};
	});
