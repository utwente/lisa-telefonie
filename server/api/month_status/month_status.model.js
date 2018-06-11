'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MonthStatusSchema = new Schema({
	month: Date,
	counter: Number,
	steps: [
		{
			name: String,
			done: Boolean,
		}
	]
});

module.exports = mongoose.model('MonthStatus', MonthStatusSchema);