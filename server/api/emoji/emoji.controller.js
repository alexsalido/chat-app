'use strict';

var _ = require('lodash');
var Emoji = require('./emoji.model');
var readFile = require('./createEmojis');
// Get list of emojis
exports.index = function(req, res) {
	readFile().then(function(data) {
		return res.status(200).json(data);
	});
  // Emoji.find(function (err, emojis) {
  //   if(err) { return handleError(res, err); }
  //   return res.status(200).json(emojis);
  // });
};
//
// // Get a single emoji
// exports.show = function(req, res) {
//   Emoji.findById(req.params.id, function (err, emoji) {
//     if(err) { return handleError(res, err); }
//     if(!emoji) { return res.status(404).send('Not Found'); }
//     return res.json(emoji);
//   });
// };
//
// // Creates a new emoji in the DB.
// exports.create = function(req, res) {
//   Emoji.create(req.body, function(err, emoji) {
//     if(err) { return handleError(res, err); }
//     return res.status(201).json(emoji);
//   });
// };
//
// // Updates an existing emoji in the DB.
// exports.update = function(req, res) {
//   if(req.body._id) { delete req.body._id; }
//   Emoji.findById(req.params.id, function (err, emoji) {
//     if (err) { return handleError(res, err); }
//     if(!emoji) { return res.status(404).send('Not Found'); }
//     var updated = _.merge(emoji, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.status(200).json(emoji);
//     });
//   });
// };
//
// // Deletes a emoji from the DB.
// exports.destroy = function(req, res) {
//   Emoji.findById(req.params.id, function (err, emoji) {
//     if(err) { return handleError(res, err); }
//     if(!emoji) { return res.status(404).send('Not Found'); }
//     emoji.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.status(204).send('No Content');
//     });
//   });
// };

function handleError(res, err) {
  return res.status(500).send(err);
}
