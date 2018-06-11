'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.IP || '127.0.0.1',
  // Server port
  port:     process.env.PORT || 9000,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGODB_URI || 'mongodb://localhost/ictsapp-dev'
  }
};
