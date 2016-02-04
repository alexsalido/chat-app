'use strict';

angular.module('chatApp')
	.factory('Conversation', function ($resource) {
		return $resource('/api/conversations/:id/:controller/:action', {
			id: '@_id'
		}, {
			message: {
				method: 'PUT',
				params: {
					controller: 'message'
				}
			},
			addToUser: {
				method: 'PUT',
				params: {
					controller: 'add'
				}
			},
			deleteFromUser: {
				method: 'PUT',
				params: {
					controller: 'delete'
				}
			}
		});
	});
