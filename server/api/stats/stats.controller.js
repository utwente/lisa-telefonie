'use strict';

var _ = require('lodash');
var TMobile = require('../t_mobile/t_mobile.model');

// Get list of statss
// without max users, much faster.
exports.index = function(req, res) {
  TMobile
    .find({month: {$gte: req.query.min_date, $lte: req.query.max_date}}, 'month summary')
    .exec(function(err, t_mobile) {
      if(err) { return handleError(res, err); }
      var result = {t_mobile: t_mobile};
      return res.json(200, result);
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
