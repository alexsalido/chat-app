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
		}, {
			provider: 'local',
			name: 'Test1',
			email: 'test1@test.com',
			password: 'test'
		}, {
			provider: 'local',
			name: 'Test2',
			email: 'test2@test.com',
			password: 'test'
		}, {
			provider: 'local',
			name: 'Test3',
			email: 'test3@test.com',
			password: 'test'
		}, {
			provider: 'local',
			name: 'Test4',
			email: 'test4@test.com',
			password: 'test'
		}, {
			provider: 'local',
			name: 'Test5',
			email: 'test5@test.com',
			password: 'test'
		}, {
			provider: 'local',
			name: 'Test6',
			email: 'test6@test.com',
			password: 'test'
		}, {
			provider: 'local',
			name: 'Test7',
			email: 'test7@test.com',
			password: 'test'
		}, {
			provider: 'local',
			name: 'Test8',
			email: 'test8@test.com',
			password: 'test'
		}, {
			provider: 'local',
			name: 'Test9',
			email: 'test9@test.com',
			password: 'test'
		}, {
			provider: 'local',
			name: 'Test10',
			email: 'test10@test.com',
			password: 'test'
		}, {
			provider: 'local',
			name: 'Test11',
			email: 'test11@test.com',
			password: 'test'
		},
		function (err, test, admin, alex, test1, test2, test3, test4, test5, test6, test7, test8, test9, test10, test11) {

			admin.contacts.addToSet(test._id, alex._id, test1._id, test2._id, test3._id, test4._id);

			admin.pendingRequests.addToSet(test5._id, test6._id, test7._id, test8._id, test9._id, test10._id, test11._id);

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
