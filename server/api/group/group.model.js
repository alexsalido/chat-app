'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var GroupSchema = new Schema({
	name: String,
	img: String,
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
		scribble: {
			type: Boolean,
			default: false
		},
		sentBy: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		date: {
			type: Date,
			default: function () {
				return new Date();
			}
		}
	}]
});

module.exports = mongoose.model('Group', GroupSchema);
