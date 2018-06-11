'use strict';

var landline_excel = require('./landline_excel')

exports.register = function(socket) {
	landline_excel.done(function(socket_event, data) {
		console.log('sending event: ' + socket_event);
		socket.emit(socket_event, data);
		return true;
	});
}