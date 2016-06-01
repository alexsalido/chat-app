'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var Image = require('../image/image.model');
var Conversation = require('../conversation/conversation.model');
var Group = require('../conversation/conversation.model');

var validationError = function (res, err) {
	return res.status(422).json(err);
};

var handleError = function (res, err, msg) {
	var message = msg || 'Oh no! An unknown error has occurred, please try again.';
	return res.status(500).json(message);
};

var objectIdFields = 'contacts sentRequests pendingRequests groups conversations';
var insensitiveFields = 'name email img status online admin members messages';
/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
	User.find({}, '-salt -hashedPassword').populate(objectIdFields, insensitiveFields).exec(function (err, users) {
		if (err) return handleError(res, err);
		res.status(200).json(users);
	});
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
	var newUser = new User(req.body);
	console.log(newUser);
	var filter = {
		info: '/default/users'
	};
	var options = {
		limit: 1
	};

	Image.findRandom(filter, {
		url: 1
	}, options, function (err, image) {
		if (err) return handleError(res, err);
		if (image[0]) newUser.img = image[0].url;
		newUser.provider = 'local';
		newUser.role = 'user';
		// newUser.save(function (err, user) {
		// 	console.log(user);
		// 	if (err) return validationError(res, err);
		// 	var token = jwt.sign({
		// 		_id: user._id
		// 	}, config.secrets.session, {
		// 		expiresInMinutes: 60 * 5
		// 	});
		// 	res.json({
		// 		token: token
		// 	});
		// });
	});
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
	var userId = req.params.id;

	User.findById(userId, function (err, user) {
		if (err) return next(err);
		if (!user) return res.status(401).send('Unauthorized');
		res.json(user.profile);
	});
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
	User.findByIdAndRemove(req.params.id, function (err, user) {
		if (err) return res.status(500).send(err);
		return res.status(204).send('No Content');
	});
};

/**
 * Add group to user
 */

exports.addGroup = function (req, res) {
	var userId = req.user._id;
	var groupId = req.body.group;
	User.findByIdAndUpdate(userId, {
		$addToSet: {
			groups: groupId
		}
	}, function (err) {
		if (err) return handleError(res, err);
		return res.status(200).send('OK');
	});
};

/**
 * Delete group from user
 */

exports.deleteGroup = function (req, res) {
	var userId = req.user._id;

};

/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
	var userId = req.user._id;
	var oldPass = String(req.body.oldPassword);
	var newPass = String(req.body.newPassword);
	User.findById(userId, function (err, user) {
		if (err) return handleError(res, err, 'Oh no! There was a problem changing your password. Please try again.');
		if (user.authenticate(oldPass)) {
			user.password = newPass;
			user.save(function (err) {
				if (err) return validationError(res, err);
				res.status(200).send({
					message: 'Your password was changed successfully.'
				});
			});
		} else {
			res.status(403).send('Forbidden');
		}
	});
};

/**
 * Change a users email
 */
exports.changeEmail = function (req, res, next) {
	var userId = req.user._id;
	var pass = String(req.body.password);
	var newEmail = String(req.body.newEmail);
	User.findById(userId, function (err, user) {
		if (err) return handleError(res, err, 'Oh no! There was a problem changing your email. Please try again.');
		if (user.authenticate(pass)) {
			user.email = newEmail;
			user.save(function (err) {
				if (err) return validationError(res, err);
				res.status(200).send({
					message: 'Your email was changed successfully.'
				});
			});
		} else {
			res.status(403).send('Forbidden');
		}
	});
};

/**
 * Change a users email
 */
exports.changeStatus = function (req, res, next) {
	var status = String(req.body.status);
	User.update({
		_id: req.user._id
	}, {
		$set: {
			status: status
		}
	}, function (err) {
		if (err) return handleError(res, err, 'Your status wasn\'t updated. An unknown error occurred, please try again.');
		res.status(200).send('Status changed successfully.');
	});
};

/**
 * Check if email is registered
 */
exports.isRegistered = function (req, res, next) {
	var email = req.params.email;
	User.findOne({
		email: email.toLowerCase()
	}, function (err, user) {
		if (err) return handleError(res, err);
		if (!user) {
			return res.status(404).json({
				field: 'email',
				message: 'This email is not registered.'
			});
		}
		return res.status(200).send({
			_id: user._id
		});
	})
};

/**
 * Send friend request
 */
exports.sendFriendRequest = function (req, res, next) {
	var to = req.body.to;
	var me = req.user;
	//Check if sender is different from receiver
	if (to != me._id) {
		//Finds sender and receiver if there is no friend request pending or if they aren't friends.
		var p1 = User.findOne({
			$and: [{
				'_id': to
			}, {
				$and: [{
					pendingRequests: {
						$ne: me._id
					}
				}, {
					contacts: {
						$ne: me._id
					}
				}, {
					sentRequests: {
						$ne: me._id
					}
				}]
			}]
		}).exec();

		var p2 = User.findOne({
			$and: [{
				'_id': me._id
			}, {
				$and: [{
					pendingRequests: {
						$ne: to
					}
				}, {
					contacts: {
						$ne: to
					}
				}, {
					sentRequests: {
						$ne: to
					}
				}]
			}]
		}).exec();

		Promise.all([p1, p2]).then(function (values) {
			var to = values[0];
			var me = values[1];
			if (to && me) {
				me.sentRequests.addToSet(to._id);
				to.pendingRequests.addToSet(me._id);

				return Promise.all([me.save(), to.save()]).then(function () {
					return res.status(200).send({
						message: 'Friend request sent successfully.'
					});
				}).catch(function (err) {
					//something went wrong when saving, rollback changes
					me.sentRequests.pull(to._id);
					to.pendingRequests.pull(me._id);
					me.save();
					to.save();
					return handleError(res, err);
				})
			} else {
				return res.status(400).send('This user is already your friend or there already is a friend request pending.');
			}
		}).catch(function (err) {
			return handleError(res, err);
		});
	} else {
		return res.status(400).send('You can\'t send a friend request to yourself.');
	}
};

/**
 * Accept friend request
 */
exports.acceptFriendRequest = function (req, res, next) {
	var from = req.body.from;
	var me = req.user;

	var p1 = User.findById(from).exec();
	var p2 = User.findById(me).exec();
	var p3 = Conversation.create({
		members: [me, from]
	});

	Promise.all([p1, p2, p3]).then(function (values) {
		var from = values[0];
		var me = values[1];
		var conversation = values[2];

		from.contacts.addToSet(me._id);
		from.sentRequests.pull(me._id);
		// from.conversations.push(conversation._id);

		me.contacts.addToSet(from._id);
		me.pendingRequests.pull(from._id);
		// me.conversations.push(conversation._id);

		return Promise.all([from.save(), me.save()]).then(function () {
			return res.status(200).send({
				message: 'Friend request accepted successfully.'
			});
		}).catch(function (err) {
			//something went wrong, rollback changes
			from.contacts.pull(me._id);
			from.sentRequests.addToSet(me._id);
			// from.conversations.pull(conversation._id);

			me.contacts.pull(from._id);
			me.pendingRequests.addToSet(from._id);
			// from.conversations.pull(conversation._id);

			from.save();
			me.save();

			return handleError(res, err);
		})

	}).catch(function (err) {
		return handleError(res, err);
	})
};

/**
 * Reject friend request
 */
exports.rejectFriendRequest = function (req, res, next) {
	var from = req.body.from;
	var me = req.user;

	var p1 = User.findById(from).exec();
	var p2 = User.findById(me).exec();

	Promise.all([p1, p2]).then(function (values) {
		var from = values[0];
		var me = values[1];

		from.sentRequests.pull(me._id);
		me.pendingRequests.pull(from._id);

		return Promise.all([from.save(), me.save()]).then(function () {
			return res.status(200).send({
				message: 'Friend request rejected successfully.'
			});
		}).catch(function (err) {
			//something went wrong, rollback changes
			from.sentRequests.addToSet(me._id);
			me.pendingRequests.addToSet(from._id);

			from.save();
			me.save();

			return handleError(res, err);
		})

	}).catch(function (err) {
		return handleError(res, err);
	})
};

/**
 * Reject friend request
 */
exports.deleteContact = function (req, res, next) {
	var user = req.body.user;
	var me = req.user;

	var p1 = User.findById(user).exec();
	var p2 = User.findById(me).exec();
	var p3 = Conversation.find({
		members: {
			$all: [user, me]
		}
	}).exec();

	Promise.all([p1, p2, p3]).then(function (values) {
		var user = values[0];
		var me = values[1];
		var conv = values[2];

		user.contacts.pull(me._id);
		me.contacts.pull(user._id);

		user.conversations.splice(user.conversations.indexOf(conv._id), 1);
		me.conversations.splice(me.conversations.indexOf(conv._id), 1);

		return Promise.all([user.save(), me.save()]).then(function () {
			return res.status(200).send({
				message: 'Contact deleted successfully.'
			});
		}).catch(function (err) {
			//something went wrong, rollback changes
			user.contacts.addToSet(me._id);
			me.contacts.addToSet(user._id);

			user.conversations.push(conv._id);
			me.conversations.push(conv._id);

			user.save();
			me.save();

			return handleError(res, err);
		})

	}).catch(function (err) {
		return handleError(res, err);
	})
};

/**
 * Get my info
 */
exports.me = function (req, res, next) {
	var userId = req.user._id;
	User.findOne({
		_id: userId
	}, '-salt -hashedPassword').populate(objectIdFields, insensitiveFields).exec(function (err, user) {
		if (err) return next(err);

		if (!user) return res.status(401).send('Unauthorized');

		var p1 = new Promise(function (resolve, reject) {
			Group.populate(user.groups, {
				path: 'members messages.sentBy',
				select: insensitiveFields
			}, function (err, user) {

				if (err) {
					return reject(err);
				}
				return resolve(user);
			});
		});
		var p2 = new Promise(function (resolve, reject) {
			Conversation.populate(user.conversations, {
				path: 'members',
				select: insensitiveFields,
				match: {
					_id: {
						$ne: userId
					}
				}
			}, function (err, user) {
				if (err) {
					return reject(err);
				}
				resolve(user);
			});
		});

		var p3 = new Promise(function (resolve, reject) {
			Conversation.populate(user.conversations, {
				path: 'messages.sentBy',
				select: insensitiveFields
			}, function (err, messages) {
				if (err) {
					return reject(err);
				}
				resolve(messages);
			});
		});

		Promise.all([p1, p2, p3]).then(function (values) {
			res.json(user);
		}).catch(function (err) {
			if (err) return next(err);
		})
	});
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
	res.redirect('/');
};
