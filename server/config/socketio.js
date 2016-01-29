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
function onDisconnect(socket) {
	var id = socket.decoded_token._id;

	User.findByIdAndUpdate(id, {
		online: false
	}, {
		new: true
	}, function (err, user) {
		if (err) console.info('User [%s] online status couldn\'t be changed', id);
		user.contacts.forEach(function (contact) {
			socket.to(contact).emit('contactsUpdated', user);
		});
	});
}

// When the user connects.. perform this
function onConnect(socket, io) {

	//Modify user status to online and notify contacts
	var id = socket.decoded_token._id;

	User.findByIdAndUpdate(id, {
		online: true
	}, {
		new: true
	}, function (err, user) {
		if (err) console.info('User [%s] online status couldn\'t be changed', id);
		user.contacts.forEach(function (contact) {
			socket.to(contact).emit('contactsUpdated', user);
		});
	});
	// When the client emits 'info', this listens and executes
	socket.on('info', function (data) {
		console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
	});

	socket.on('friendRequest:sent', function (to) {
		console.info('Friend request sent to [%s] from [%s]', to, id);

		var p1 = User.findById(id, insensitiveFields).exec();
		var p2 = User.findById(to, insensitiveFields).exec();

		Promise.all([p1, p2]).then(function (values) {
			var from = values[0];
			var to = values[1];

			if (to && from) {
				socket.emit('sentRequestsUpdated', to);
				socket.to(to._id).emit('pendingRequestsUpdated', from);
			}
		});
	});

	socket.on('friendRequest:accepted', function (from) {
		console.log('Friend request from [%s] accepted by [%s].', from, id);

		var p1 = User.findById(id, insensitiveFields).exec();
		var p2 = User.findById(from, insensitiveFields).exec();

		Promise.all([p1, p2]).then(function (values) {
			var to = values[0];
			var from = values[1];

			if (from && to) {
				socket.emit('pendingRequestsUpdated', from);
				socket.to(from._id).emit('sentRequestsUpdated', to);
				socket.emit('contactsUpdated', from);
				socket.to(from._id).emit('contactsUpdated', to);
			}
		});
	});

	socket.on('friendRequest:rejected', function (from) {
		console.info('Friend request from [%s] rejected by [%s].', from, id);

		var p1 = User.findById(id, insensitiveFields).exec();
		var p2 = User.findById(from, insensitiveFields).exec();

		Promise.all([p1, p2]).then(function (values) {
			var to = values[0];
			var from = values[1];

			if (from && to) {
				socket.emit('pendingRequestsUpdated', from);
				socket.to(from._id).emit('sentRequestsUpdated', to);
			}
		});
	});

	socket.on('contact:delete', function (user) {
		console.info('[%s] deleted [%s] from their contact list.', id, user);

		var p1 = User.findById(id, insensitiveFields).exec();
		var p2 = User.findById(user, insensitiveFields).exec();

		Promise.all([p1, p2]).then(function (values) {
			var me = values[0];
			var user = values[1];

			if (me && user) {
				socket.emit('contactsUpdated', user, 'delete');
				socket.to(user._id).emit('contactsUpdated', me, 'delete');
			}
		});
	});

	socket.on('message:sent', function (room, msg, toGroup) {
		console.info('Message sent to [%s] from [%s].', room, id);


		if (toGroup) {
			socket.to(room).emit('message:received', id, msg, room);
			Group.findByIdAndUpdate(room, {
				$push: {
					messages: {
						text: msg,
						sentBy: id
					}
				}
			}, function (err) {
				if (err) console.info('Error saving message [%s] from [%s] to [%s]', msg, id, room);
			});
		} else {
			socket.to(room).emit('message:received', id, msg);
			Conversation.findOneAndUpdate({
					members: {
						$all: [room, id]
					}
				}, {
					$push: {
						messages: {
							text: msg,
							sentBy: id
						}
					}
				}, {
					new: true
				},
				function (err, conversation) {
					if (err) console.info('Error saving message [%s] from [%s] to [%s]', msg, id, room);
				});
		}
	});

	socket.on('conversation:new', function (user) {
		Conversation.findOne({
			members: {
				$all: [user, id]
			}
		}).populate('members', insensitiveFields).exec(function (err, conversation) {
			User.findByIdAndUpdate(id, {
				$addToSet: {
					conversations: conversation._id
				}
			}, function (err) {
				socket.emit('conversationsUpdated', conversation);
			})
		});
	});

	socket.on('conversation:delete', function (user) {
		Conversation.findOne({
			members: {
				$all: [user, id]
			}
		}).populate('members', insensitiveFields).exec(function (err, conversation) {
			User.findByIdAndUpdate(id, {
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
		console.info('[%s] ADDED TO GROUP [%s]', participant, id);
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

	// socketio.use(function(socket, next) {
	// 	console.log(socket.decoded_token);
	// 	next();
	// });

	socketio.on('connection', function (socket) {

		socket.address = socket.request.connection.remoteAddress + ':' + socket.request.connection.remotePort;
		// socket.address = socket.handshake.address !== null ?
		// 	socket.handshake.address.address + ':' + socket.handshake.address.port :
		// 	process.env.DOMAIN;

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
