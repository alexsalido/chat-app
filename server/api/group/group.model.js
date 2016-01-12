'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var GroupSchema = new Schema({
	name: String,
	admin: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
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

module.exports = mongoose.model('Group', GroupSchema);
