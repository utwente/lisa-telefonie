'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  active: Boolean,
  name: String,
  email: String,
  department: { type: Schema.Types.ObjectId, ref: 'Department' },
  subdepartment: String,
  internalAddress: String,
  landlineNumber: String,
  shortNumber: String,
  mobileNumber: String,
  imeiNumber: String,
  duoSim: Boolean,
  internetModule: String,
  internetActivationDate: Date,
  comments: [Schema.Types.Mixed],
  activationDate: Date,
  phoneType: String,
  employmentSince: String,
  history: Schema.Types.Mixed
});

module.exports = mongoose.model('Customer', CustomerSchema);