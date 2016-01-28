'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var User = require('../user/user.model');
var Image = require('../image/image.model');

var insensitiveFields = 'name email img status online admin members messages';

// Get list of groups
exports.index = function (req, res) {
	Group.find({}).populate('members', insensitiveFields).exec(function (err, groups) {
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

	Image.findRandom(filter, {
		url: 1
	}, options, function (err, image) {
		if (err) return handleError(res, err);
		req.body.img = image[0].url;
		Group.create(req.body, function (err, group) {
			if (err) {
				return handleError(res, err, 'Oh no! There was a problem creating the group. Please try again.');
			}
			return res.status(201).json({
				message: 'The group was created successfully.',
				group: group
			});
		});
	});
};

// Updates an existing group in the DB.
exports.update = function (req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	Group.findById(req.params.id, function (err, group) {
		if (err) {
			return handleError(res, err);
		}
		if (!group) {
			return res.status(404).send('Not Found');
		}
		var updated = _.merge(group, req.body);
		updated.save(function (err) {
			if (err) {
				return handleError(res, err);
			}
			return res.status(200).json(group);
		});
	});
};

// Deletes a group from the DB.
exports.destroy = function (req, res) {
	Group.findById(req.params.id, function (err, group) {
		if (err) {
			return handleError(res, err);
		}
		if (!group) {
			return res.status(404).send('Not Found');
		}
		group.remove(function (err) {
			if (err) {
				return handleError(res, err);
			}
			return res.status(204).send('No Content');
		});
	});
};

function handleError(res, err, msg) {
	var message = msg || 'Oh no! An unknown error has occurred, please try again.';
	return res.status(500).json(message);
};
