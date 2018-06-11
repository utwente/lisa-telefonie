'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var KpnSchema = new Schema({
  month: {type: Date, index: true},
  summary: {
  	totalCosts: Number
  }, 
  numbers: [{
  	number: String,
  	amount: Number
  }]
});

module.exports = mongoose.model('Kpn', KpnSchema);