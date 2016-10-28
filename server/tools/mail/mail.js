'use strict';

var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-direct-transport');

var mail = require("nodemailer").mail;


module.exports = function Mail() {

    var options = {
        host: process.env['MAIL_HOST'],             // use this for UT mail
        port: process.env['MAIL_PORT'],
        debug: true
    }
    var transporter = nodemailer.createTransport(options);

    this.send = function(data, callback) {

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