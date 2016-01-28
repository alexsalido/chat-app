'use strict';

angular.module('chatApp')
	.factory('Group', function ($resource) {
		return $resource('/api/groups/:id', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	});
