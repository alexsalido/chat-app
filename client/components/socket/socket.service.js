/* global io */
'use strict';

angular.module('chatApp')
	.factory('socket', function (socketFactory, Auth) {

		var socket;

		function createSocket(id) {

			// socket.io now auto-configures its connection when we ommit a connection url
			var ioSocket = io('', {
				// Send auth token on connection, you will need to DI the Auth service above
				'query': 'token=' + Auth.getToken(),
				'force new connection': true,
				path: '/socket.io-client'
			});

			socket = socketFactory({
				ioSocket: ioSocket
			});

			socket.emit('room', id);
		}

		return {
			socket: socket,

			createSocket: createSocket,

			createRoom: function (id) {
				socket.emit('room', id);
			},

			disconnect: function () {
				socket.disconnect();
			},

			friendRequest: function (to, from) {
				socket.emit('friendRequest', to, from);
			},

			friendRequestAccepted: function (user) {
				socket.emit('friendRequest:Accepted', user, Auth.getCurrentUser()._id);
			},

			friendRequestRejected: function (user) {
				socket.emit('friendRequest:Rejected', user, Auth.getCurrentUser()._id);
			},

			deleteContact: function (user) {
				socket.emit('deleteContact', user, Auth.getCurrentUser()._id);
			},

			/**
			 * Register listeners to sync an array with updates on a model
			 *
			 * Takes the array we want to sync, the model name that socket updates are sent from,
			 * and an optional callback function after new items are updated.
			 *
			 * @param {String} modelName
			 * @param {Array} array
			 * @param {Function} cb
			 */
			syncUpdates: function (modelName, array, cb) {
				cb = cb || angular.noop;

				/**
				 * Syncs item creation/updates on 'model:save'
				 */
				socket.on(modelName + ':save', function (item) {
					var oldItem = _.find(array, {
						_id: item._id
					});
					var index = array.indexOf(oldItem);
					var event = 'created';

					// replace oldItem if it exists
					// otherwise just add item to the collection
					if (oldItem) {
						array.splice(index, 1, item);
						event = 'updated';
					} else {
						array.push(item);
					}

					cb(event, item, array);
				});

				/**
				 * Syncs removed items on 'model:remove'
				 */
				socket.on(modelName + ':remove', function (item) {
					var event = 'deleted';
					_.remove(array, {
						_id: item._id
					});
					cb(event, item, array);
				});
			},

			syncSent: function (array, cb) {
				cb = cb || angular.noop;

				socket.on('sentRequestsUpdated', function (item) {

					var oldItem = _.find(array, {
						_id: item._id
					});
					var index = array.indexOf(oldItem);
					var event = 'created';

					// delete oldItem if it exists
					// otherwise just add item to the collection
					if (oldItem) {
						array.splice(index, 1);
						event = 'updated';
					} else {
						array.push(item);
					}

					cb(event, item, array);
				});
			},

			syncPending: function (array, cb) {
				cb = cb || angular.noop;
				socket.on('pendingRequestsUpdated', function (item) {
					var oldItem = _.find(array, {
						_id: item._id
					});
					var index = array.indexOf(oldItem);
					var event = 'created';

					// delete oldItem if it exists
					// otherwise just add item to the collection
					if (oldItem) {
						array.splice(index, 1);
						event = 'updated';
					} else {
						array.push(item);
					}

					cb(event, item, array);
				});
			},

			syncContacts: function (array, cb) {
				cb = cb || angular.noop;
				socket.on('contactsUpdated', function (item, event) {
					var oldItem = _.find(array, {
						_id: item._id
					});
					var index = array.indexOf(oldItem);

					if (event == 'delete') {
						array.splice(index, 1);
					} else {
						// replace oldItem if it exists
						// otherwise just add item to the collection
						if (oldItem) {
							array.splice(index, 1, item);
							event = 'updated';
						} else {
							array.push(item);
							event = 'created';
						}
					}

					cb(event, item, array);
				});
			},

			/**
			 * Removes listeners for a models updates on the socket
			 *
			 * @param modelName
			 */
			unsyncUpdates: function (modelName) {
				socket.removeAllListeners(modelName + ':save');
				socket.removeAllListeners(modelName + ':remove');
			}
		};
	});
