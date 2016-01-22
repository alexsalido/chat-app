'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ChatSchema = new Schema({
	members: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	messages: [{
		text: String,
		postedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		date: Date
	}]
});

module.exports = mongoose.model('Chat', ChatSchema);
