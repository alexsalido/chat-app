'use strict';

angular.module('chatApp')
	.factory('User', function ($resource) {
		return $resource('/api/users/:id/:controller/:action', {
			id: '@_id'
		}, {
			addGroup: {
				method: 'PUT',
				params: {
					controller: 'group',
					action: 'add'
				}
			},
			changePassword: {
				method: 'PUT',
				params: {
					controller: 'password'
				}
			},
			changeEmail: {
				method: 'PUT',
				params: {
					controller: 'email'
				}
			},
			changeStatus: {
				method: 'PUT',
				params: {
					controller: 'status'
				}
			},
			sendFriendRequest: {
				method: 'PUT',
				params: {
					controller: 'request'
				}
			},
			acceptFriendRequest: {
				method: 'PUT',
				params: {
					controller: 'request',
					action: 'accept'
				}
			},
			rejectFriendRequest: {
				method: 'PUT',
				params: {
					controller: 'request',
					action: 'reject'
				}
			},
			deleteContact: {
				method: 'PUT',
				params: {
					controller: 'contact',
					action: 'delete'
				}
			},
			get: {
				method: 'GET',
				params: {
					id: 'me'
				}
			}
		});
	});
