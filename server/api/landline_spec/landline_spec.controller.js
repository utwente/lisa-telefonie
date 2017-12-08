'use strict';

var _ = require('lodash');
var TMobile = require('../t_mobile/t_mobile.model');
var Specification = require('../specification/specification.model');
var XLSXLLGenerator = require(__tools + 'landline/landline_excel');
var fs = require('fs');

Date.prototype.monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
};

// unit to make normal (from camelcase)!
String.prototype.toNormal = function() {
    return this.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^[a-z]/, function(m){ return m.toUpperCase() });
};

// Generate a month
exports.show = function(req, res) {
  TMobile.find({month: req.params.month}, function (err, t_mobile) {
    if (t_mobile.length === 0) {return res.send(404); }
    if(err) { return res.status(500).send(err); }

    // there should be only one t_mobile per month
    t_mobile = t_mobile[0];

    Specification.find({}, function (err, specification) {
      if (err) {return res.status(500).send(err); }

      // get all information about the persons who need specifications.
      var spec_info = [];
      _.forEach(specification, function(number) {
        var found = _.filter(t_mobile.numbers, {number: number.number});
        if (found.length !== 0) {
          spec_info.push(found[0]);
        } else {
          spec_info.push({
            number: number.number,
            empty: true
          })
        }
      });
      // all information for the landline specifications is now in spec_info.

      // if not yet done, create folder for the month and make a subfolder with "vast"
      var month = new Date(req.params.month);
      var monthName = month.getMonthName() + ' ' + month.getFullYear();
      mkdirSync(__doc + monthName);
      var fullPath = __doc + monthName + '/vast/';
      mkdirSync(fullPath);

      var xlsx = new XLSXLLGenerator();
      for (var i = 0; i < spec_info.length; i++) {
        xlsx.generate(spec_info[i].number, fullPath, spec_info[i], 'll_excel', spec_info.length);
      }

      return res.json(200, 'done!');

    });

  });

};


function mkdirSync(path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code !== 'EEXIST' ) throw e;
  }
}
