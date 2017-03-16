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
    if(err) { return handleError(res, err); }
    
    // there should be only one t_mobile per month
    t_mobile = t_mobile[0];

    Specification.find({}, function (err, specification) {
      if (err) {return handleError(res,err); }


      // get all information about the persons that need specifications.
      var found = _.filter(t_mobile.numbers, {number: req.params.number});
      if (found.length !== 0) {
        var info = found[0];
      } else {
        var info = {
          number: req.params.number,
          empty: true
        };
      }
      // all information for the number is now in info.

      // if not yet done, create folder for the month and make a subfolder with "vast"
      switch (req.params.type) {
        case 'landline': 
          var path = findLandlinePath(req.params.month);
          break;
        case 'mobile':
          var path = findMobilePath(req.params.month);
          break;
      }

      console.log(info);
      
      var xlsx = new XLSXLLGenerator();
      xlsx.generate(info.number, path, info, 'none', 1, function(){

        var filename = 'Specificatie ' + info.number + '.xlsx';
        var filePath = path + filename;

        fs.readFile(filePath, function(err, data){
            if(err) { return handleError(res, err); } 
            return res.send(new Buffer(data, 'binary'));
        })

      });



    });

  });

};

function handleError(res, err) {
  return res.send(500, err);
}

function mkdirSync(path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

function findMobilePath(month) {
  var date = new Date(month);
  var monthName = date.getMonthName() + ' ' + date.getFullYear();
  mkdirSync(__doc + monthName);
  var fullPath = __doc + monthName + '/mobiel/';
  mkdirSync(fullPath);
  return fullPath;
}

function findLandlinePath(month) {
  var date = new Date(month);
  var monthName = date.getMonthName() + ' ' + date.getFullYear();
  mkdirSync(__doc + monthName);
  var fullPath = __doc + monthName + '/vast/';
  mkdirSync(fullPath);
  return fullPath;
}