'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TMobileSchema = new Schema({
  month: {type: Date, index: true},
  summary: {
    totalCosts: Number,
    totalTime: Number,
    perType: Schema.Types.Mixed
  },
  numbers: [{
    number: {type: String, index: true},
    calls: Schema.Types.Mixed,
    data: Schema.Types.Mixed,
    summary: {
      totalCosts: {type: Number, index: true},
      totalTime: {type: Number, index: true},
      totalKB: {type: Number, index: true},
      totalSMS: {type: Number, index: true},
      perType: Schema.Types.Mixed
    }
  }]
});

module.exports = mongoose.model('TMobile', TMobileSchema);