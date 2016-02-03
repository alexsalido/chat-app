'use strict';

angular.module('chatApp')
	.factory('Group', function ($resource) {
		return $resource('/api/groups/:id/:controller/:action', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			message: {
				method: 'PUT',
				params: {
					controller: 'message'
				}
			},
			addParticipants: {
				method: 'PUT',
				params: {
					controller: 'participant',
					action: 'add'
				}
			},
			removeParticipant: {
				method: 'PUT',
				params: {
					controller: 'participant',
					action: 'remove'
				}
			}
		});
	});
