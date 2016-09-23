'use strict';

var _ = require('lodash');
var MonthStatus = require('./month_status.model');

// Get list of month_statuss
exports.index = function(req, res) {
  MonthStatus.find(function (err, month_statuss) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(month_statuss);
  });
};

// Get a single month_status
exports.show = function(req, res) {
  MonthStatus.find({month: req.params.month}, function (err, month_status) {
    if(err) { return handleError(res, err); }
    month_status = month_status[0];
    if( typeof(month_status) == 'undefined') { 
      // month does nog exist yet in database, so create it!
      month_status = getNewProgress(req.params.month)
      MonthStatus.create(month_status, function(err, month_status) {
        if(err) { return handleError(res, err); }
        return res.json(month_status);
      });
    } else {
      return res.json(month_status);
    }
  });
};

// Creates a new month_status in the DB.
exports.create = function(req, res) {
  MonthStatus.create(req.body, function(err, month_status) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(month_status);
  });
};

// Updates an existing month_status in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  MonthStatus.findById(req.params.id, function (err, month_status) {
    if (err) { return handleError(res, err); }
    if(!month_status) { return res.status(404).send('Not Found'); }
    month_status.counter = req.body.counter;
    month_status.steps = req.body.steps;
    month_status.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(month_status);
    });
  });
};

// Deletes a month_status from the DB.
exports.destroy = function(req, res) {
  MonthStatus.findById(req.params.id, function (err, month_status) {
    if(err) { return handleError(res, err); }
    if(!month_status) { return res.status(404).send('Not Found'); }
    var month = month_status.month;
    // destroy old month_status
    month_status.remove(function(err) {
      if(err) { return handleError(res, err); }
      // create fresh month_status
      month_status = getNewProgress(req.params.month)
      MonthStatus.create(month_status, function(err, month_status) {
        if(err) { return handleError(res, err); }
        return res.json(month_status);
      });
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

function getNewProgress(month) {
  var progress = {};
  progress.month = month;
  progress.counter = 0;
  progress.steps =  [     
    {
      name: 'check',
      done: false
    },
    {
      name: 'mobile',
      done: false
    },
    {
      name: 'landline',
      done: false
    },
    {
      name: 'check_spec',
      done: false
    },
    {
      name: 'send',
      done: false
    },
    {
      name: 'done',
      done: false
    }
  ];
  return progress;
}