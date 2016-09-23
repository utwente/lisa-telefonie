/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var MonthStatus = require('./month_status.model');

exports.register = function(socket) {
  MonthStatus.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  MonthStatus.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('month_status:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('month_status:remove', doc);
}