'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var Image = require('../image/image.model');

var validationError = function (res, err) {
	return res.status(422).json(err);
};

var handleError = function (res, err, msg) {
	var message = msg || 'Oh no! An unknown error has occurred, please try again.';
	return res.status(500).json(message);
};

var objectIdFields = 'contacts sent pending groups';
var insensitiveFields = 'name email img status';
/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
	User.find({}, '-salt -hashedPassword', function (err, users) {
		if (err) return res.status(500).send(err);
	}).populate(objectIdFields, insensitiveFields).exec(function (err, users) {
		if (err) return handleError(res, err);
		res.status(200).json(users);
	});
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
	var newUser = new User(req.body);
	newUser.provider = 'local';
	newUser.role = 'user';

	var filter = {
		info: 'default/users'
	};

	var options = {
		limit: 1
	};

	Image.findRandom(filter, {
		url: 1
	}, options, function (err, image) {
		if (err) return res.status(500).send(err);
		newUser.img = image[0].url;
		newUser.save(function (err, user) {
			if (err) return handleError(res, err);
			var token = jwt.sign({
				_id: user._id
			}, config.secrets.session, {
				expiresInMinutes: 60 * 5
			});
			res.json({
				token: token
			});
		});
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
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
	var userId = req.user._id;
	var oldPass = String(req.body.oldPassword);
	var newPass = String(req.body.newPassword);
	User.findById(userId, function (err, user) {
		if (user.authenticate(oldPass)) {
			user.password = newPass;
			user.save(function (err) {
				if (err) return handleError(res, err, 'Oh no! There was a problem changing your password. Please try again.');
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
		if (user.authenticate(pass)) {
			user.email = newEmail;
			user.save(function (err) {
				if (err) return handleError(res, err, 'Oh no! There was a problem changing your email. Please try again.');
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
	var from = req.user;
	//Check if sender is different from receiver
	if (to != from._id) {
		//Finds sender and receiver if there is no friend request pending or if they aren't friends.
		User.find({
				$or: [{
					$and: [{
						'_id': to
					}, {
						$and: [{
							pending: {
								$ne: from._id
							}
						}, {
							contacts: {
								$ne: from._id
							}
						}, {
							sent: {
								$ne: from._id
							}
						}]
					}]
				}, {
					$and: [{
						'_id': from._id
					}, {
						$and: [{
							pending: {
								$ne: to
							}
						}, {
							contacts: {
								$ne: to
							}
						}, {
							sent: {
								$ne: to
							}
						}]
					}]
				}]
			},
			function (err, docs) {
				if (err) return handleError(res, err);
				//if sender and receiver are found process friend request
				if (docs.length !== 2) {
					return res.status(400).send('This user is already your friend or there already is a friend request pending.');
				} else {
					to = docs[0];
					from = docs[1];
					from.sent.addToSet(to._id);
					to.pending.addToSet(from._id);
					to.save(function (err) {
						if (err) return handleError(res, err);
						from.save(function (err) {
							if (err) return handleError(res, err);
							return res.status(200).send({
								message: 'Friend request sent successfully.'
							});

						})
					});
				}
			})
	} else {
		return res.status(400).send('You can\'t send a friend request to yourself.');
	}
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
		res.json(user);
	});
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
	res.redirect('/');
};
