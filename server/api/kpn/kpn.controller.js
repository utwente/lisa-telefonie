'use strict';

var _ = require('lodash');
var Kpn = require('./kpn.model');

// Get list of months
exports.index = function(req, res) {
  Kpn.find({}, '_id summary month', function (err, kpns) {
    // console.log(kpns);
    if(err) { return handleError(res, err); }
    return res.json(200, kpns);
  });
};

// Get a single month
exports.show = function(req, res) {
  console.log('showing month');
  var date = req.params.month;
  Kpn.findOne({month: date}, function (err, month) {
    if(err) { return handleError(res, err); }
    if(!month) { 
      return res.send(404); 
    }
    return res.json(month);
  });
};

// Creates a new month in the DB.
exports.create = function(req, res) {
  Kpn.find({month: req.body.kpn.month}, function(err, month) {
    if (month.length !== 0) {
      // the month exists already..
      return res.json(200, {error: true, msg: 'month_exists', id: month[0]._id});
    } else {
      Kpn.create(req.body.kpn, function(err, kpn) {
        if(err) { return handleError(res, err); }
        return res.json(201, {success: true, msg: 'month_created', id: kpn._id});
      });
    }
  });
};

// Updates an existing kpn in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Kpn.findById(req.params.id, function (err, kpn) {
    if (err) { return handleError(res, err); }
    if(!kpn) { return res.send(404); }
    var updated = _.merge(kpn, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, kpn);
    });
  });
};

// Deletes a kpn from the DB.
exports.destroy = function(req, res) {
  Kpn.findById(req.params.id, function (err, kpn) {
    if(err) { return handleError(res, err); }
    if(!kpn) { return res.send(404); }
    kpn.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}