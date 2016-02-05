'use strict';

var express = require('express');
var controller = require('./image.controller');
var multer = require('multer');
var s3 = require('multer-s3');

var router = express.Router();

var upload = multer({
	storage: s3({
		dirname: 'uploads',
		bucket: process.env.BUCKET,
		secretAccessKey: process.env.AWS_SECRETACCESSKEY,
		accessKeyId: process.env.AWS_ACCESSKEYID,
		region: 'us-east-1',
		filename: function (req, file, callback) {
			var ext = file.originalname.match(/\.[0-9a-z]+$/i)[0];
			req.body.ext = ext;
			callback(null, req.params.id + ext);
		}
	}),
	limits: {
		fileSize: process.env.IMAGE_MAX_SIZE
	},
	fileFilter: function (req, file, callback) {
		if (!!!file.mimetype.match(/image/i)) callback(new Error('Uploaded file is not an image.'));
		else if (parseInt(req.headers['content-length']) > process.env.IMAGE_MAX_SIZE) callback(new Error('File size exceeded.'));
		else callback(null, true);
	}
})

router.get('/', controller.index);
router.get('/random/:type', controller.random);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id/user', upload.single('file'), controller.userUpload);
router.put('/:id/group', upload.single('file'), controller.groupUpload);
router.delete('/:id', controller.destroy);



module.exports = router;
