'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.IP,
  // Server port
  port:     process.env.PORT,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGODB_URI
  }
};