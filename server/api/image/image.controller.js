'use strict';

var _ = require('lodash');
var Image = require('./image.model');

//AWS
var AWS = require('aws-sdk');

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESSKEYID,
	secretAccessKey: process.env.AWS_SECRETACCESSKEY
});

var s3 = new AWS.S3({
	apiVersion: '2006-03-01'
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

// Updates an existing image in the DB.
exports.update = function (req, res) {
	var userid = req.params.userid;
	var id = req.params.id;

	s3.getObject({
		Bucket: process.env.BUCKET,
		Key: 'default/users/' + userid
	}, function (err, data) {
		if (err) { //not found
		} else {
			//found
		}
	});

	if (req.body._id) {
		delete req.body._id;
	}
	Image.findById(req.params.id, function (err, image) {
		if (err) {
			return handleError(res, err);
		}
		if (!image) {
			return res.status(404).send('Not Found');
		}
		var updated = _.merge(image, req.body);
		updated.save(function (err) {
			if (err) {
				return handleError(res, err);
			}
			return res.status(200).json(image);
		});
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
