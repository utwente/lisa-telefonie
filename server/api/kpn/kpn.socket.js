/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Kpn = require('./kpn.model');

exports.register = function(socket) {
  Kpn.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Kpn.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('kpn:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('kpn:remove', doc);
}