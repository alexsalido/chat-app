/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var User = require('../../server/api/user/user.model');
var Conversation = require('../../server/api/conversation/conversation.model');
var insensitiveFields = 'name email img status online';
// When the user disconnects.. perform this
function onDisconnect(socket) {}

// When the user connects.. perform this
function onConnect(socket, io) {

	// When the client emits 'info', this listens and executes
	socket.on('info', function (data) {
		console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
	});

	socket.on('friendRequest', function (to, from) {
		console.log('Friend request sent by user with id [%s]', from);
		User.findById(to, insensitiveFields, function (err, to) {
			User.findById(from, insensitiveFields, function (err, from) {
				socket.emit('sentRequestsUpdated', to);
				socket.to(to._id).emit('pendingRequestsUpdated', from);
			});
		});
	});

	socket.on('friendRequest:Accepted', function (user, me) {
		console.log('Friend request from [%s] accepted by [%s].', user, me);
		User.findById(user, insensitiveFields, function (err, user) {
			User.findById(me, insensitiveFields, function (err, me) {
				socket.emit('pendingRequestsUpdated', user);
				socket.to(user._id).emit('sentRequestsUpdated', me);
				socket.emit('contactsUpdated', user);
				socket.to(user._id).emit('contactsUpdated', me);
			});
		});
	});

	socket.on('friendRequest:Rejected', function (user, me) {
		console.log('Friend request from [%s] rejected by [%s].', user, me);
		User.findById(user, insensitiveFields, function (err, user) {
			User.findById(me, insensitiveFields, function (err, me) {
				socket.emit('pendingRequestsUpdated', user);
				socket.to(user._id).emit('sentRequestsUpdated', me);
			});
		});
	});

	socket.on('deleteContact', function (user, me) {
		console.log('[%s] deleted [%s] from their contact list.', me, user);

		User.findById(user, insensitiveFields, function (err, user) {
			User.findById(me, insensitiveFields, function (err, me) {
				socket.emit('contactsUpdated', me, 'delete');
				socket.to(user._id).emit('contactsUpdated', user, 'delete');
			});
		});
	});

	socket.on('message:sent', function (room, me, msg) {
		console.log('Message sent to [%s] from [%s].', room, me);
		socket.to(room).emit('message:received', me, msg);

		Conversation.findOne({
			members: {
				$all: [room, me]
			}
		}, function (err, conversation) {
			conversation.messages.push({
				text: msg,
				sentBy: me
			});
			conversation.save();
		});
	});

	// Insert sockets below
	// require('../api/group/group.socket').register(socket);
	// require('../api/image/image.socket').register(socket);
	// require('../api/emoji/emoji.socket').register(socket);
	// require('../api/thing/thing.socket').register(socket);
	// require('../api/user/user.socket').register(socket);
}

module.exports = function (socketio) {
	// socket.io (v1.x.x) is powered by debug.
	// In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
	//
	// ex: DEBUG: "http*,socket.io:socket"

	// We can authenticate socket.io users and access their token through socket.handshake.decoded_token
	//
	// 1. You will need to send the token in `client/components/socket/socket.service.js`
	//
	// 2. Require authentication here:
	socketio.use(require('socketio-jwt').authorize({
		secret: config.secrets.session,
		handshake: true
	}));

	socketio.on('connection', function (socket) {

		socket.address = socket.handshake.address !== null ?
			socket.handshake.address.address + ':' + socket.handshake.address.port :
			process.env.DOMAIN;

		socket.connectedAt = new Date();

		//Create room
		socket.on('room', function (id) {
			socket.join(id);
			console.info('ROOM [%s] CREATED', id);
		});

		// Call onDisconnect.
		socket.on('disconnect', function () {
			onDisconnect(socket);
			console.info('[%s] DISCONNECTED', socket.address);
		});

		// Call onConnect.
		onConnect(socket, socketio);
		console.log(socketio.engine.clientsCount + ' clients connected to socket.');
		console.info('[%s] CONNECTED', socket.address);
	});
};
