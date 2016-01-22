/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Group = require('./conversation.model');

exports.register = function(socket) {
  Group.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Group.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('conversation:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('conversation:remove', doc);
}
