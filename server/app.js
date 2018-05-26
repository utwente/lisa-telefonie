/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// This is needed for node version 0 unfortunately
if (!Object.assign){
	Object.assign = require('object-assign')
}
Array.prototype.find = require('array.prototype.find').shim();

// setup server
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Set global variables
global.__tools = __dirname + '/tools/';
global.__doc = __dirname + '/../data/months/';
global.__templates = __dirname + '/templates/';

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
app.use(bodyParser.json({limit: '20mb'}));

var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode!', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
