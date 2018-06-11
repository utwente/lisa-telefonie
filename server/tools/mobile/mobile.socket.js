'use strict';

// var excel = require('./excelgenerator');
var pdf = require('./pdfgenerator');
var excel = require('./excelgenerator');
var html = require('./htmlgenerator');

exports.register = function(socket) {

	pdf.done(function(socket_event, data) {
		console.log('sending event: ' + socket_event);
		socket.emit(socket_event, data);
	});

	excel.done(function(socket_event, data) {
		console.log('sending event: ' + socket_event);
		socket.emit(socket_event, data);
	});

	html.done(function(socket_event, data) {
		console.log('sending event: ' + socket_event);
		socket.emit(socket_event, data);
	});
	
}