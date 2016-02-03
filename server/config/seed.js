/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Img = require('../api/image/image.model');
var Group = require('../api/group/group.model');
var Conversation = require('../api/conversation/conversation.model');

//AWS
var AWS = require('aws-sdk');

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESSKEYID,
	secretAccessKey: process.env.AWS_SECRETACCESSKEY
});

var s3 = new AWS.S3({
	apiVersion: '2006-03-01'
});

// Img.find({}).remove(function () {
//
// 	s3.listObjects({
// 		Bucket: 'tm-chatapp',
// 		Prefix: 'default/users'
// 	}, function (err, data) {
// 		if (err) {
// 			console.log('Unsuccessful request to default user images');
// 			console.log(err, err.stack);
// 		} else {
// 			console.log('Successful request to default user images');
// 			data.Contents.forEach(function (currentValue, index, array) {
// 				if (index !== 0) {
// 					Img.create({
// 						url: process.env.BUCKET_URL + currentValue.Key,
// 						info: '/default/users'
// 					})
// 				}
// 			})
// 		}
// 	});
//
// 	s3.listObjects({
// 		Bucket: 'tm-chatapp',
// 		Prefix: 'default/groups'
// 	}, function (err, data) {
// 		if (err) {
// 			console.log('Unsuccessful request to default group images');
// 			console.log(err, err.stack);
// 		} else {
// 			console.log('Successful request to default group images');
// 			data.Contents.forEach(function (currentValue, index, array) {
// 				if (index !== 0) {
// 					Img.create({
// 						url: process.env.BUCKET_URL + currentValue.Key,
// 						info: '/default/groups'
// 					})
// 				}
// 			})
// 		}
// 	});
// })

User.find({}).remove(function () {
	User.create({
			provider: 'local',
			name: 'Test',
			email: 'test@test.com',
			password: 'test'
		}, {
			provider: 'local',
			role: 'admin',
			name: 'Admin',
			email: 'admin@admin.com',
			password: 'admin'
		}, {
			provider: 'local',
			role: 'admin',
			name: 'Alex',
			email: 'alexsalidoa@gmail.com',
			password: '123456'
		},
		function (err, test, admin, alex) {
			admin.contacts.addToSet(test._id, alex._id);

			test.contacts.addToSet(admin._id);

			alex.contacts.addToSet(admin._id);

			Conversation.create({
				members: [admin._id, test._id]
			}, {
				members: [admin._id, alex._id]
			}).then(function (conv1, conv2) {
				// admin.conversations.push(conv1._id);
				// test.conversations.push(conv1._id);
				// admin.conversations.push(conv2._id);
				// alex.conversations.push(conv2._id);

			});
			alex.save();
			test.save();
			admin.save();
			console.log('finished populating users');
		});
});

Group.find({}).remove(function () {
	console.log('Deleted existing groups.');
});
Conversation.find({}).remove(function () {
	console.log('Deleted existing conversations.');
});
