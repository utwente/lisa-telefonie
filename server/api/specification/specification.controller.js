'use strict';

var _ = require('lodash');
var Specification = require('./specification.model');

// Get list of specifications
exports.index = function(req, res) {
  Specification.find(function (err, specifications) {
    if(err) { return handleError(res, err); }
    return res.json(200, specifications);
  });
};

// Get a single specification
exports.show = function(req, res) {
  Specification.findById(req.params.id, function (err, specification) {
    if(err) { return handleError(res, err); }
    if(!specification) { return res.send(404); }
    return res.json(specification);
  });
};

// Creates a new specification in the DB.
exports.create = function(req, res) {

  req.body.active = true;
  req.body.createdOn = new Date();

  Specification.create(req.body, function(err, specification) {
    if(err) { return handleError(res, err); }
    return res.json(201, specification);
  });
};

// Updates an existing specification in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Specification.findById(req.params.id, function (err, specification) {
    if (err) { return handleError(res, err); }
    if(!specification) { return res.send(404); }
    var updated = _.merge(specification, req.body);

    updated.updatedOn = new Date();
    
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, specification);
    });
  });
};

// Deletes a specification from the DB.
exports.destroy = function(req, res) {
  Specification.findById(req.params.id, function (err, specification) {
    if(err) { return handleError(res, err); }
    if(!specification) { return res.send(404); }
    specification.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}