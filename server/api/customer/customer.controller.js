'use strict';

var _ = require('lodash');
var Customer = require('./customer.model');

// Get list of active customers
exports.index = function(req, res) {
  Customer.find({}).where('active').equals(true).populate('department').exec(function (err, customers) {
    if(err) { return handleError(res, err); }
    return res.json(200, customers);
  });
};

// Get a single customer
exports.show = function(req, res) {
  Customer.findById(req.params.id).populate('department').exec(function (err, customer) {
    if(err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }
    return res.json(200, customer);
  });
};

// Find customer by number
exports.byNumber = function(req, res) {
  var number = req.params.number;
  Customer.findOne({mobileNumber: number}, 'name department', function(err, customer){
    if (err){handleError(res, err)}
    if (!customer){return res.send(404)}
    customer.populate('department', function(err) {
      if (err){handleError(res, err)}
      return res.json(200, customer);
    });
  });
}

// Find customers by department
exports.byDepartment = function(req, res) {
  var department = req.params.department;
  Customer.find({department: department}, 'name mobileNumber', function(err, customers){
    if (err){handleError(res, err)}
    return res.json(200, customers);
  })
}


// Creates a new customer in the DB.
exports.create = function(req, res) {
  req.body.active = true;   // Set active to true
  Customer.create(req.body, function(err, customer) {
    if(err) { return handleError(res, err); }
    if (!customer){return res.json(404)}
    customer.populate('department', function(err) {
      if (err){handleError(res, err)}
      return res.json(201, customer);
    });
  });
};

// Updates an existing customer in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Customer.findById(req.params.id, function (err, customer) {
    if (err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }
    var newCustomer = req.body;
    newCustomer.department = newCustomer.department._id;
    var updated = _.merge(customer, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, customer);
    });
  });
};

// Deletes a customer from the DB.
exports.destroy = function(req, res) {
  Customer.findById(req.params.id, function (err, customer) {
    if(err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }
    customer.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Updates an existing customer in the DB.
exports.trash = function(req, res) {
  Customer.findById(req.params.id, function (err, customer) {
    if (err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }
    var deactivated = _.merge(customer, req.body);
  
    deactivated.active = false;
    
    deactivated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, customer);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}