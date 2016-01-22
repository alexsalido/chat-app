'use strict';

var _ = require('lodash');
var Conversation = require('./conversation.model');
var User = require('../user/user.model');

// Get list of conversations
exports.index = function (req, res) {
	Conversation.find(function (err, conversations) {
		if (err) {
			return handleError(res, err);
		}
		return res.status(200).json(conversations);
	});
};

// Get a single conversation
exports.show = function (req, res) {
	Conversation.findById(req.params.id, function (err, conversation) {
		if (err) {
			return handleError(res, err);
		}
		if (!conversation) {
			return res.status(404).send('Not Found');
		}
		return res.json(conversation);
	});
};

// Creates a new conversation in the DB.
exports.create = function (req, res) {
	Conversation.create(req.body, function(err, conversation) {
      if(err) { return handleError(res, err); }
      return res.status(201).json(conversation);
    });
};

// Updates an existing conversation in the DB.
exports.update = function (req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	Conversation.findById(req.params.id, function (err, conversation) {
		if (err) {
			return handleError(res, err);
		}
		if (!conversation) {
			return res.status(404).send('Not Found');
		}
		var updated = _.merge(conversation, req.body);
		updated.save(function (err) {
			if (err) {
				return handleError(res, err);
			}
			return res.status(200).json(conversation);
		});
	});
};

// Deletes a conversation from the DB.
exports.destroy = function (req, res) {
	Conversation.findById(req.params.id, function (err, conversation) {
		if (err) {
			return handleError(res, err);
		}
		if (!conversation) {
			return res.status(404).send('Not Found');
		}
		conversation.remove(function (err) {
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
