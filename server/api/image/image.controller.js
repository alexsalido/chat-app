'use strict';

var _ = require('lodash');
var Image = require('./image.model');

var User = require('../user/user.model');
var Group = require('../group/group.model');

//AWS
var AWS = require('aws-sdk');

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESSKEYID,
	secretAccessKey: process.env.AWS_SECRETACCESSKEY
});

var s3 = new AWS.S3({
	apiVersion: process.env.AWS_API_VERSION
});

// Get list of images
exports.index = function (req, res) {
	Image.find(function (err, images) {
		if (err) {
			return handleError(res, err);
		}
		return res.status(200).json(images);
	});
};

// Get a single image
exports.show = function (req, res) {
	Image.findById(req.params.id, function (err, image) {
		if (err) {
			return handleError(res, err);
		}
		if (!image) {
			return res.status(404).send('Not Found');
		}
		return res.json(image);
	});
};

// Creates a new image in the DB.
exports.create = function (req, res) {
	Image.create(req.body, function (err, image) {
		if (err) {
			return handleError(res, err);
		}
		return res.status(201).json(image);
	});
};

// returns group Image if it exists, creates it if it doesn't
exports.userUpload = function (req, res) {
	var userId = req.params.id;
	Image.findOne({
		'info': userId
	}, function (err, image) {
		if (err) return handleError(res, err);
		if (image) {
			return res.status(200).json(image);
		} else {
			Image.create({
				url: process.env.BUCKET_URL_UPLOADS + userId + req.body.ext,
				info: userId
			}).then(function (image) {
				User.findById(userId, function (err, user) {
					if (err) return handleError(res, err);
					if (user) {
						user.img = image.url;
						user.save(function (err) {
							if (err) return handleError(res, err);
							return res.status(200).json(image);
						});
					}
				});
			});
		}
	});
};

// returns group Image if it exists, creates it if it doesn't
exports.groupUpload = function (req, res) {
	var groupId = req.params.id;
	Image.findOne({
		'info': groupId
	}, function (err, image) {
		if (err) return handleError(res, err);
		if (image) {
			return res.status(200).json(image);
		} else {
			Image.create({
				url: process.env.BUCKET_URL_UPLOADS + groupId + req.body.ext,
				info: groupId
			}).then(function (image) {
				Group.findById(groupId, function (err, group) {
					if (err) return handleError(res, err);
					if (group) {
						group.img = image.url;
						group.messages.push({
							text: 'Group\'s image changed.',
							sentBy: req.user._id,
							update: true
						});
						group.save(function (err) {
							if (err) return handleError(res, err);
							return res.status(200).json(image);
						});
					}
				});
			});
		}
	});
};

// Deletes a image from the DB.
exports.destroy = function (req, res) {
	Image.findById(req.params.id, function (err, image) {
		if (err) {
			return handleError(res, err);
		}
		if (!image) {
			return res.status(404).send('Not Found');
		}
		image.remove(function (err) {
			if (err) {
				return handleError(res, err);
			}
			return res.status(204).send('No Content');
		});
	});
};

// Get random image for new user
exports.random = function (req, res) {
	var filter = {
		info: 'default/' + req.params.type
	};

	var options = {
		limit: 1
	};

	Image.findRandom(filter, {
		url: 1
	}, options, function (err, image) {
		if (err) {
			return handleError(res, err);
		}
		return res.status(200).json(image);
	});
};

function handleError(res, err) {
	return res.status(500).send(err);
}
