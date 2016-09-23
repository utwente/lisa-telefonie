/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Specification = require('./specification.model');

exports.register = function(socket) {
  Specification.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Specification.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('specification:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('specification:remove', doc);
}