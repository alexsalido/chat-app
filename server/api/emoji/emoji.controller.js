'use strict';

var _ = require('lodash');
var Emoji = require('./emoji.model');
var readFile = require('./createEmojis');

// Get list of emojis
exports.index = function(req, res) {
	readFile().then(function(data) {
		return res.status(200).json(data);
	});
};

function handleError(res, err) {
  return res.status(500).send(err);
}
