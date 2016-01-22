'use strict';

angular.module('chatApp')
	.factory('Conversation', function ($resource) {
		return $resource('/api/conversations/:id');
	});
