/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /Hvd              ->  index
 * POST    /Hvd              ->  create
 * GET     /Hvd/:id          ->  show
 * PUT     /Hvd/:id          ->  update
 * DELETE  /Hvd/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Hvd = require('./hvd.model.js');

// Get list of Hvds
exports.index = function(req, res) {
  Hvd.find(function (err, Hvds) {
    if(err) { return handleError(res, err); }
    return res.json(200, Hvds);
  });
};

// Get a single Hvd
exports.show = function(req, res) {
  Hvd.findById(req.params.id, function (err, Hvd) {
    if(err) { return handleError(res, err); }
    if(!Hvd) { return res.send(404); }
    return res.json(Hvd);
  });
};

// Creates a new Hvd in the DB.
exports.create = function(req, res) {
  Hvd.create(req.body, function(err, Hvd) {
    if(err) { return handleError(res, err); }
    return res.json(201, Hvd);
  });
};

// Updates an existing Hvd in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Hvd.findById(req.params.id, function (err, Hvd) {
    if (err) { return handleError(res, err); }
    if(!Hvd) { return res.send(404); }
    var updated = _.merge(Hvd, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, Hvd);
    });
  });
};

// Deletes a Hvd from the DB.
exports.destroy = function(req, res) {
  Hvd.findById(req.params.id, function (err, Hvd) {
    if(err) { return handleError(res, err); }
    if(!Hvd) { return res.send(404); }
    Hvd.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Updates an existing Hvd in the DB.
exports.deactivate = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Hvd.findById(req.params.id , function (err, Hvd) {
    if (err) { return handleError(res, err); }
    if(!Hvd) { return res.send(404); }
    var updated = _.merge(Hvd, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, Hvd);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}