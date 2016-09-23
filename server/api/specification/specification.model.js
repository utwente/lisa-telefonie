'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SpecificationSchema = new Schema({
  number: String,
  name: String,
  email: String,
  active: Boolean,
  createdOn: Date,
  updatedOn: Date,
  deactivatedOn: Date
});

module.exports = mongoose.model('Specification', SpecificationSchema);