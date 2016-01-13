'use strict';

angular.module('chatApp')
	.factory('User', function ($resource) {
		return $resource('/api/users/:id/:controller', {
			id: '@_id'
		}, {
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
			get: {
				method: 'GET',
				params: {
					id: 'me'
				}
			}
		});
	});
