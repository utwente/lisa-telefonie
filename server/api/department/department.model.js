'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DepartmentSchema = new Schema({
  name: String,
  email: String,
  createdOn: Date,
  updatedOn: Date,
  deactivatedOn: Date,
  active: Boolean
});

module.exports = mongoose.model('Department', DepartmentSchema);