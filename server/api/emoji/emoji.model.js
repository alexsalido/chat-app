'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EmojiSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Emoji', EmojiSchema);