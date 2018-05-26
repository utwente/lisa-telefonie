'use strict';

var fs = require('fs');

var Specification = require('../specification/specification.model');
var Attachments = require('../mobile_spec/mobile_spec.model');
var Handlebars = require('handlebars');

var Mail = require(__tools + 'mail/mail');
var Queue = require(__tools + 'queue/queue');


// Get a single mail_spec
exports.show = function(req, res) {

	this.updateSocket = function(){};

	var llbuf = fs.readFileSync(__templates + 'landline_spec.hbs','utf8')
	var llTemplate = Handlebars.compile(llbuf);
	var mobbuf = fs.readFileSync(__templates + 'department_spec.hbs','utf8')
	var depTemplate = Handlebars.compile(mobbuf);

	var month = new Date(req.params.month);
	var monthName = month.getMonthName() + ' ' + month.getFullYear();
	var fullPath = __doc + monthName + '/vast/';

	// var to = "floriaan.post@gmail.com";

	var m = new Mail();

	var config = {
		delay_factor: 2,
		send: function(msg, done) {m.send(msg, function(err, data) {done(err);});},
		update: function(status) {exports.show.updateSocket('mail_send',status);},
		error: function(msg) {exports.show.updateSocket('server_error', msg);},
		max_attempts: 3													// something might go wrong, so try 3 times before failing completely
	}

	// the queue takes the function that actually sends the mail as argument.
	var q = new Queue(config)

	// Landline part below
	Specification.find({}, function (err, specification) {
		if (err) {return res.status(500).send(err); }

		for (var i = 0; i < specification.length; i++) {
			var to = specification[i].email; // -> only do this when you are really sure ;)

			var data = {
				to: to,
				subject: 'Specificatie ' + specification[i].number + ' ' + monthName,
				current: specification[i].number,
				path: fullPath,
				filenames: ['Specificatie ' + specification[i].number + '.xlsx'],
				message: llTemplate({number: specification[i].number}),
				socket_event: 'll_mail',		// this is used for the socket.
				total: specification.length 	// used to log the progress client side
			}

			q.add(data);

		}
	});

	// Mobile part below
	Attachments.findOne({month: month}, function(err, result) {

		if (err) {return res.status(500).send(err); }
		if (result === null) { console.log('attachments not found...'); return res.status(404).send({code: 'ERRORS'}); }

			var attachments = result;

			// overview email
			for (var department in attachments.departments) {

				var to = attachments.departments[department].email; // -> only do this when you are really sure ;)

				var data = {
					to: to,
					subject: 'Specificaties mobiele telefoonkosten ' + monthName,
					department: department,
					number: false,
					count: false,
					path: attachments.departments[department].pdf_category.path,
					filenames: [
						attachments.departments[department].pdf_category.filename,
						attachments.departments[department].pdf_numbers.filename,
						attachments.departments[department].excel.filename
					],
					message: depTemplate({}),
					socket_event: 'mob_mail',		// this is used for the socket.
					total: 0 						// used to log the progress client side
				}

				q.add(data);

			}

			// personal specifications email
			for (var department in attachments.departments) {

				var to = attachments.departments[department].email; // -> only do this when you are really sure ;)

				for (var i = 0; i < attachments.departments[department].html.length; i++) {

					var data = {
						to: to,
						subject: 'Specificaties mobiel persoonlijk ' + monthName + ' ' +  attachments.departments[department].html[i].number,
						department: department,
						number: attachments.departments[department].html[i].number,
						count: i,
						path: attachments.departments[department].html[i].path,
						filenames: [],
						message: fs.readFileSync(attachments.departments[department].html[i].path + attachments.departments[department].html[i].filename),
						socket_event: 'mob_personal',
						total: 0
					}
					q.add(data);
				}
			}


	});


	return res.status(200).json('Verzonden!');

};



function handleError(res, err) {
	return res.status(500).send(err);
}

exports.show.update = function(callback) {
	exports.show.updateSocket = callback;
}
