'use strict';

var fs = require('fs');
var nodemailer = require('nodemailer');

var smtpPool = require('nodemailer-smtp-pool');

module.exports = function Mail() {

    var options = {
        host: process.env['MAIL_HOST'],
        port: process.env['MAIL_PORT'],
        maxConnections: process.env['MAIL_MAX_CONNECTIONS'],
        maxMessages: process.env['MAIL_MAX_MESSAGES'],
        rateLimit: process.env['MAIL_RATE_LIMIT'],
        debug: true,
        tls: {rejectUnauthorized: false}
    }

    var transporter = nodemailer.createTransport(smtpPool(options));

    this.send = function(data, callback) {

        // random result (for testing)
        // var result = Math.round(Math.random())==1;
        // callback(result, {msg: 'test_message'}); 
        // return;

        var department = data.department,
            number = data.number,
            count = data.count,
            filenames = data.filenames,
            path = data.path,
            subject = data.subject;

        var attachments = [];

        for (var i = 0; i < filenames.length; i++) {
            var file = fs.readFileSync(path + filenames[i]);
            if (file === undefined){
                callback(true, {department: department, number: number, count: count, msg: 'no attachment', total: data.total}); 
                return;
            }
            attachments.push({filename: filenames[i], content: file});
        }

        var mailOptions = { 
            from: process.env['MAIL_FROM'],
            to: data.to,
            subject: subject,
            html: data.message,    
            attachments: attachments,
        };

        transporter.sendMail(mailOptions, function(err, success) {
            if (err) {
                console.log(err);
                callback(err, {department: department, number: number, count: count, msg: 'mail not send: ' + err.code, total: data.total});
                return;
            };
            callback(err, {department: department, number: number, count: count, msg: 'mail send', total: data.total});

        });

    }
}