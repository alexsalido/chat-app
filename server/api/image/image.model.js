'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var random = require('mongoose-simple-random');

var ImageSchema = new Schema({
	url: String,
	info: String
});

ImageSchema.plugin(random);


module.exports = mongoose.model('Image', ImageSchema);
