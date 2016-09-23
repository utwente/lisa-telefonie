'use strict';

var mail_spec = require('./mail_spec.controller')

exports.register = function(socket) {
	mail_spec.show.update(function(socket_event, data) {
		console.log('sending event: ' + socket_event);
		socket.emit(socket_event, data);
	});
}