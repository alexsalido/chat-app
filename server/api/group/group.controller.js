'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var User = require('../user/user.model');
var Image = require('../image/image.model');

var insensitiveFields = 'name email img status online admin members messages';

// Get list of groups
exports.index = function (req, res) {
	Group.find({}).populate('members messages.sentBy', insensitiveFields).exec(function (err, groups) {
		if (err) {
			return handleError(res, err);
		}
		return res.status(200).json(groups);
	});
};

// Get a single group
exports.show = function (req, res) {
	Group.findById(req.params.id).populate('members', insensitiveFields).exec(function (err, group) {
		if (err) {
			return handleError(res, err);
		}
		if (!group) {
			return res.status(404).send('Not Found');
		}
		return res.json(group);
	});
};

// Creates a new group in the DB.
exports.create = function (req, res) {
	var filter = {
		info: '/default/groups'
	};
	var options = {
		limit: 1
	};

	//Step1: Get random Image
	//Step2: Create Group
	//Step3: Add group to User
	Image.findRandom(filter, {
		url: 1
	}, options, function (err, image) {
		if (err) return handleError(res, err);
		req.body.img = image[0].url;
		Group.create(req.body, function (err, group) {
			if (err) {
				return handleError(res, err, 'Oh no! There was a problem creating the group. Please try again.');
			}
			User.findByIdAndUpdate(group.admin, {
				$addToSet: {
					groups: group._id
				}
			}, function (err) {
				if (err) {
					group.remove();
					return handleError(res, err, 'Oh no! There was a problem creating the group. Please try again.');
				}
				return res.status(201).json({
					message: 'The group was created successfully.',
					group: group
				});
			})
		});
	});
};

// Updates group's name
exports.name = function (req, res) {
	Group.findOneAndUpdate({
			_id: req.params.id,
			admin: req.user._id
		}, {
			name: req.body.name,
			$push: {
				messages: {
					text: 'Group\'s name changed.',
					sentBy: req.user._id,
					update: true
				}
			}
		}, {
			new: true
		},
		function (err, group) {
			if (err) {
				return handleError(res, err);
			}
			if (!group) {
				return res.status(404).send('Not Found');
			}
			return res.status(200).json(group);
		});
};

//Add participant(s) to group
exports.addParticipants = function (req, res) {
	var groupId = req.params.id;
	var userIds = req.body.users;
	var userEmails = req.body.emails;
	var message = '';

	userEmails.forEach(function (email, index, emails) {
		message += email;
		if (index == emails.length - 1) {
			message += ' '
		} else {
			message += ', '
		}
	});

	var p1 = Group.findOneAndUpdate({
		_id: groupId,
		admin: req.user._id
	}, {
		$addToSet: {
			members: {
				$each: userIds
			}
		},
		$push: {
			messages: {
				text: message + ' added to group.',
				sentBy: req.user._id,
				update: true,
			}
		}
	}).exec();

	var promises = [p1];

	userIds.forEach(function (userId) {
		var p = User.findByIdAndUpdate(userId, {
			$addToSet: {
				groups: groupId
			}
		}).exec();
		promises.push(p);
	});

	Promise.all(promises).then(function (values) {
		return res.status(200).json({
			message: 'Participants added successfully.',
		});
	}).catch(function (err) {
		Group.findByIdAndUpdate(groupId, {
			$pull: {
				members: {
					$each: userIds
				}
			},
			$pop: {
				messages: 1
			}
		}).exec();

		userIds.forEach(function (userId) {
			User.findByIdAndUpdate(userId, {
				$pull: {
					groups: groupId
				}
			}).exec();
		});

		if (err) {
			return handleError(res, err);
		}
	});
};

//Remove participant from group
exports.removeParticipant = function (req, res) {
	var groupId = req.params.id;
	var userId = req.body.user;
	var userEmail = req.body.email;

	var message = userEmail + ' left the group.';

	if (req.user.id !== userId) {
		message = userEmail + ' kicked from group.'
	}

	var p1 = Group.findOneAndUpdate({
		_id: groupId,
		admin: req.user._id
	}, {
		$pull: {
			members: userId
		},
		$push: {
			messages: {
				text: message,
				sentBy: req.user._id,
				update: true,
			}
		}
	}, {
		new: true
	}).exec();

	var p2 = User.findByIdAndUpdate(userId, {
		$pull: {
			groups: groupId
		}
	}).exec();

	Promise.all([p1, p2]).then(function (values) {
		var group = values[0];
		var user = values[1];

		if (group && user) {
			if (group.members.length === 0) {
				//No members in group, time to delete it
				group.remove();
			} else if (group.admin.equals(user._id)) {
				//if admin left, appoint a new one
				group.admin = group.members[0];
				group.save();
			}
			return res.status(200).json({
				message: 'Group left successfully.',
			});
		}
	}).catch(function (err) {
		Group.findByIdAndUpdate(groupId, {
			$addToSet: {
				members: userId
			},
			$pop: {
				messages: 1
			}
		}).exec();

		User.findByIdAndUpdate(userId, {
			$addToSet: {
				groups: groupId
			}
		}).exec();


		if (err) {
			return handleError(res, err);
		}
	});
};

exports.message = function (req, res) {
	var groupId = req.params.id;
	var msg = req.body.msg;

	Group.findByIdAndUpdate(groupId, {
		$push: {
			messages: {
				text: msg.text,
				sentBy: msg.sentBy,
				scribble: msg.scribble
			}
		}
	}, function (err) {
		if (err) return handleError(res, err, 'Sorry, there was a problem saving one of your messages.');
		return res.status(200).json({
			message: 'Message saved successfully.',
		});
	})
};

function handleError(res, err, msg) {
	var message = msg || 'Oh no! An unknown error has occurred, please try again.';
	return res.status(500).json(message);
};
