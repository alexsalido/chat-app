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

			socket.on('message:received', function (from, msg) {

				var convExists = _.find(Auth.getCurrentUser().conversations, function (conversation) {
					if (conversation.members.indexOf(from) !== -1) {
						conversation.messages.push({
							text: msg,
							sentBy: from
						});
						return true;
					}
				});

				if (!convExists) {
					socket.emit('conversation:new', from, Auth.getCurrentUser()._id);
				}
			});
		}

		return {
			socket: socket,

			createSocket: createSocket,

			createRoom: function (id) {
				socket.emit('room', id);
			},

			createConversation: function (user) {
				socket.emit('conversation:new', user, Auth.getCurrentUser()._id);
			},

			deleteConversation: function (user) {
				socket.emit('conversation:delete', user, Auth.getCurrentUser()._id);
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

			sendMessage: function (room, msg) {
				socket.emit('message:sent', room, Auth.getCurrentUser()._id, msg);
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

			syncConversations: function (array, cb, scope) {
				cb = cb || angular.noop;
				socket.on('conversationsUpdated', function (item, event) {

					item.members.splice(item.members.indexOf(Auth.getCurrentUser()._id), 1);

					var oldItem = _.find(array, {
						_id: item._id
					});

					var index = array.indexOf(oldItem);

					if (oldItem) {
						array.splice(index, 1);
						event = 'deleted';
					} else {
						array.push(item);
						event = 'created';
					}

					cb(event, item, array);
				});
			}
		};
	});
