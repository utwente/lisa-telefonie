'use strict';

var customers = require('./customers');

exports.register = function(socket) {
	customers.error(function(socket_event, data) {
		console.log('sending event: ' + socket_event);
		socket.emit(socket_event, data);
	});
}