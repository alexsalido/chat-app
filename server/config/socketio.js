/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var User = require('../../server/api/user/user.model');
var Conversation = require('../../server/api/conversation/conversation.model');
var Group = require('../../server/api/group/group.model');
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

	socket.on('message:sent', function (room, me, msg, toGroup) {
		console.log('Message sent to [%s] from [%s].', room, me);
		if (toGroup) {
			socket.to(room).emit('message:received', me, msg, room);
			Group.findByIdAndUpdate(room, {
				$push: {
					messages: {
						text: msg,
						sentBy: me
					}
				}
			}, function (err) {
				if (err) console.log('Error saving message [%s] from [%s] to [%s]', msg, me, room);
			});
		} else {
			socket.to(room).emit('message:received', me, msg);
			Conversation.findOneAndUpdate({
					members: {
						$all: [room, me]
					}
				}, {
					$push: {
						messages: {
							text: msg,
							sentBy: me
						}
					}
				}, {
					new: true
				},
				function (err, conversation) {
					if (err) console.log('Error saving message [%s] from [%s] to [%s]', msg, me, room);
				});
		}
	});

	socket.on('conversation:new', function (user, me) {
		Conversation.findOne({
			members: {
				$all: [user, me]
			}
		}).populate('members', insensitiveFields).exec(function (err, conversation) {
			User.findByIdAndUpdate(me, {
				$addToSet: {
					conversations: conversation._id
				}
			}, function (err) {
				socket.emit('conversationsUpdated', conversation);
			})
		});
	});

	socket.on('conversation:delete', function (user, me) {
		Conversation.findOne({
			members: {
				$all: [user, me]
			}
		}).populate('members', insensitiveFields).exec(function (err, conversation) {
			User.findByIdAndUpdate(me, {
				$pull: {
					conversations: conversation._id
				}
			}, function (err) {
				socket.emit('conversationsUpdated', conversation);
			})
		});
	});

	//Create/join room for group
	socket.on('group', function (id) {
		console.info('ROOM [%s] CREATED FOR GROUP', id);
		socket.join(id);
	});

	socket.on('group:added', function (id, participant) {
		console.log('[%s] ADDED TO GROUP [%s]', participant, id);
		var p1 = Group.findById(id).populate('members', insensitiveFields).exec();
		var p2 = User.findByIdAndUpdate(participant, {
			$addToSet: {
				groups: id
			}
		}).exec();

		Promise.all([p1, p2]).then(function (values) {
			if (values[0] && values[1]) {
				io.sockets.to(participant).emit('groupsUpdated', values[0]);
				for (var socketId in io.nsps['/'].adapter.rooms[participant].sockets) {
					var _socket = io.sockets.connected[socketId];
					_socket.join(id);
				}
			}
		}).catch(function (err) {
			console.log(err);
		});
	});

	socket.on('group:exit', function (id, participant) {
		console.info('User [%s] has left group [%s].', participant, id);
		var p1 = Group.findByIdAndUpdate(id, {
			$pull: {
				members: participant
			}
		}, {
			new: true
		}).populate('members', insensitiveFields).exec();
		var p2 = User.findByIdAndUpdate(participant, {
			$pull: {
				groups: id
			}
		}).exec();

		Promise.all([p1, p2]).then(function (values) {
			var group = values[0];
			var participant = values[1]

			if (group && participant) {
				socket.emit('groupsUpdated', group, 'delete');

				//if group doesn't have any members, delete it
				if (group.members.length === 0) {
					console.info('Group [%s] has been deleted.', group._id);
					group.remove();
				}
				//if user that left is the admin, assign another admin
				if (group.admin.equals(participant._id) && group.members.length > 0) {
					group.admin = group.members[0]._id
					group.save();
				}

				socket.to(id).emit('groupsUpdated', group);
				socket.to(id).emit('message:received', null, participant.email + ' left the group.', id);
				socket.leave(id);
			}
		}).catch(function (err) {
			console.log(err);
		});
	});

	socket.on('group:kicked', function (id, participant) {
		console.info('User [%s] has been kicked out of group [%s].', participant, id);

		var p1 = Group.findByIdAndUpdate(id, {
			$pull: {
				members: participant
			}
		}, {
			new: true
		}).populate('members', insensitiveFields).exec();
		var p2 = User.findByIdAndUpdate(participant, {
			$pull: {
				groups: id
			}
		}).exec();

		Promise.all([p1, p2]).then(function (values) {
			if (values[0] && values[1]) {
				socket.to(participant).emit('groupsUpdated', values[0], 'delete');
				for (var socketId in io.nsps['/'].adapter.rooms[participant].sockets) {
					var _socket = io.sockets.connected[socketId];
					_socket.leave(id);
				}
				socket.to(id).emit('groupsUpdated', values[0]); //notify everyone in the group
				socket.emit('groupsUpdated', values[0]); //notify myself
				socket.to(id).emit('message:received', null, values[1].email + ' was kicked from the group.', id);
			}
		}).catch(function (err) {
			console.log(err);
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
			console.info('ROOM [%s] CREATED', id);
			socket.join(id);
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
