'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HvdScheme = new Schema({
  phoneNumber: String,
  mediapack: String,
  mediapackPort: { type: Number, min: 1, max: 24 },
  hvd: String,
  to: String,
  po: String,
  location: String,
  comment: String,
  updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hvd', HvdScheme);