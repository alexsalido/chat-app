'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ConversationSchema = new Schema({
	members: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	messages: [{
		text: String,
		sentBy: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		date: {
			type: Date,
			default: new Date().toUTCString()
		}
	}]
});

module.exports = mongoose.model('Conversation', ConversationSchema);
