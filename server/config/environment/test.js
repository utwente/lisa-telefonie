'use strict';

// Test specific configuration
// ===========================
module.exports = {

  // Server IP
  ip:       undefined,

  // Server port
  port:     8080,

  // MongoDB connection options
  // example connection string: 'mongodb://username:password@host:port/database'
  mongo: {
    uri: 	'mongodb://localhost/ictsapp-test'
  },

  // fill database with sample user
  seedDB: false

};