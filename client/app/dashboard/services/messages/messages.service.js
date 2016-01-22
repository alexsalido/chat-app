'use strict';

angular.module('chatApp')
	.service('messages', function (Conversation) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return {
			getMessages: function (userId, me) {},
			$get: function () {
				return messages;
			}
		}
	});
