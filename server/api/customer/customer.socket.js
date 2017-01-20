/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Customer = require('./customer.model');

exports.register = function(socket) {
  Customer.schema.post('save', function (doc) {
  	if(doc.active)
    	onSave(socket, doc);
    else
    	onRemove(socket, doc);
  });
  Customer.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, customer, cb) {
  customer.populate('department', function(err) {
    socket.emit('customer:save', customer);
  });
}

function onRemove(socket, doc, cb) {
  socket.emit('customer:remove', doc);
}