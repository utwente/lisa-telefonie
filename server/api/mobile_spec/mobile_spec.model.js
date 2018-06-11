'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AttachmentsSchema = new Schema({
  month: {type: Date, index: true},
  departments: Schema.Types.Mixed
});

module.exports = mongoose.model('Attachments', AttachmentsSchema);