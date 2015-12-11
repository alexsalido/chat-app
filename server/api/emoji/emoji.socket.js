/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Emoji = require('./emoji.model');

exports.register = function(socket) {
  Emoji.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Emoji.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('emoji:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('emoji:remove', doc);
}