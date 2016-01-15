'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var User = require('../user/user.model');

// Get list of groups
exports.index = function (req, res) {
	Group.find(function (err, groups) {
		if (err) {
			return handleError(res, err);
		}
		return res.status(200).json(groups);
	});
};

// Get a single group
exports.show = function (req, res) {
	Group.findById(req.params.id, function (err, group) {
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
	Group.create(req.body, function (err, group) {
		if (err) {
			return handleError(res, err, 'Oh no! There was a problem creating the group. Please try again.');
		}
		User.findById(req.body.admin, function (err, user) {
			if (err) {
				return handleError(res, err);
			}
			user.groups.addToSet(group._id);
			user.save(function (err) {
				if (err) return handleError(res, err);
			});
			return res.status(201).json('The group was created successfully.');
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
