/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var User = require('./user.model');

exports.register = function (socket) {
	User.schema.post('save', function (doc) {
		onSave(socket, doc);
	});
	User.schema.post('remove', function (doc) {
		onRemove(socket, doc);
	});

	User.schema.on('friendRequest', function (to, from) {
		onFriendRequest(socket, to, from);
	});
}

function onSave(socket, doc, cb) {
	socket.emit('user:save', doc);
}

function onRemove(socket, doc, cb) {
	socket.emit('user:remove', doc);
}

function onFriendRequest(socket, to, from, cb) {
	console.log('Notified friend request');
	socket.to(from._id).emit('user:friendRequestSent', to);
	socket.to(to._id).emit('user:friendRequestReceived', from);

}
