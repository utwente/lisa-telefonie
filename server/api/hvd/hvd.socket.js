/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var hvd = require('./hvd.model.js');

exports.register = function(socket) {
  hvd.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  hvd.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('hvd:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('hvd:remove', doc);
}