'use strict';

var _ = require('lodash');
var TMobile = require('./t_mobile.model');

// // with max users, a bit slow...
// exports.index = function(req, res) {
//   TMobile
//     .find({month: {$gte: req.query.min_date, $lte: req.query.max_date}}, 'month summary numbers.summary numbers.number')
//     .exec(function(err, months) {
//       if(err) { return handleError(res, err); }
//       var numbers;
//       for (var i = months.length - 1; i >= 0; i--) {
//         numbers = months[i].numbers;
//         numbers.sort(function(a,b){return b.summary.totalCosts - a.summary.totalCosts});
//         delete months.numbers;
//         months[i].numbers = numbers.slice(0,req.query.numbers);
//       };
//       return res.json(200, months);
//     });
// };

// without max users, much faster.
exports.index = function(req, res) {
  TMobile
    .find({month: {$gte: req.query.min_date, $lte: req.query.max_date}}, 'month summary')
    .exec(function(err, months) {
      if(err) { return handleError(res, err); }
      return res.json(200, months);
    });
};

exports.show = function(req, res) {
  TMobile.find({month: req.params.month}, function (err, t_mobile) {
    if (t_mobile.length === 0) {
      return res.send(404);
    }
    if(err) { return handleError(res, err); }
    console.log('Length t-mobile: ' + t_mobile[0].numbers.length);
    return res.json(t_mobile[0]);
  });
};

// Creates a new t_mobile in the DB.
exports.create = function(req, res) {
  TMobile.find({month: req.body.t_mobile.month}, function(err, month) {
    if (month.length !== 0) {
      // the month exists already..
      return res.json(200, {error: true, msg: 'month_exists', id: month[0]._id})
    } else {
      TMobile.create(req.body.t_mobile, function(err, t_mobile) {
        if(err) { return handleError(res, err); }
        return res.json(201, {success: true, msg: 'month_created', id: t_mobile._id});
      });
    }
  });
};

// Updates an existing t_mobile in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  TMobile.findById(req.params.id, function (err, t_mobile) {
    if (err) { return handleError(res, err); }
    if(!t_mobile) { return res.send(404); }
    t_mobile.remove(function(err) {
      if(err) { return handleError(res, err); }
      TMobile.create(req.body, function(err, t_mobile) {
        if(err) { return handleError(res, err); }
        return res.json(201, {success: true, msg: 'month_updated', id: t_mobile._id});
      });
    });
  });
};

// Deletes a t_mobile from the DB.
exports.destroy = function(req, res) {
  TMobile.findById(req.params.id, function (err, t_mobile) {
    if(err) { return handleError(res, err); }
    if(!t_mobile) { return res.send(404); }
    t_mobile.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}