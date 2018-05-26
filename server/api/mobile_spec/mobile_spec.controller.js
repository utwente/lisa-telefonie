'use strict';

var _ = require('lodash');
var fs = require('fs');

var TMobile = require('../t_mobile/t_mobile.model');
var Attachments = require('./mobile_spec.model');

var Customer = require(__tools + 'customers/customers');
var PDFGenerator = require(__tools + 'mobile/pdfgenerator');
var ExcelGenerator = require(__tools + 'mobile/excelgenerator');

Date.prototype.monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
};

// Generate a month
exports.show = function(req, res) {
  TMobile.findOne({month: req.params.month}, function (err, t_mobile) {
    if (t_mobile === null) {return res.send(404); }
    if (t_mobile.length === 0) {return res.send(404); }
    if(err) { return res.status(500).send(err); }

    t_mobile = t_mobile.numbers;

    var attachments = {
      month: req.params.month,
      departments: {}
    }

    // Customer provides some tools for searching in the customers etc.
    var c = new Customer();
    c.load(function(err) {
      if (err) { return res.status(500).send(err); }

      // create some date stuff i'm going to need later.
      var month = new Date(req.params.month);
      var monthName = month.getMonthName() + ' ' + month.getFullYear();
      var monthNumber = month.getMonth() + 1;
      var yearMonth = month.getFullYear() + '-' + (monthNumber < 10 ? '0' + monthNumber: '' + monthNumber);

      // if not yet done, create folder for the month and make a subfolder with "mobiel".
      mkdirSync(__doc + monthName);
      var fullPath = __doc + monthName + '/mobiel/';
      mkdirSync(fullPath);

      var department_spec = {}
      var skip;
      var error = false;

      for (var i = t_mobile.length - 1; i >= 0; i--) {

        skip = false;

        var data = c.findDepartmentByNumber(t_mobile[i].number)

        switch (data.code) {
          case 'NO_CUSTOMER_DATA':    return res.status(404).send(data);          // there are no customers defined, serious error, stop all execution.
          case 'NO_DEPARTMENT_DATA':  return res.status(404).send(data);          // there are no departments defined, serious error, stop all execution.
          case 'UNKNOWN_NUMBER':      skip = true; error = true; break;           // the number requested is unknown, error send by socket, but do continue.
          case 'UNKNOWN_DEPARTMENT':  skip = true; break;                         // the department of the requested number does not exists in department table.
          case 'NO_NAME':             break;                                      // the number does not have a name specified, don't skip but send warning.
          case 'NO_DEPARTMENT':       skip = true; break;                         // the requested number has no department specified, warning send by socket.
          case 'LANDLINE':            skip = true; break;                         // the number requested is a landline number, no problem, just skip it.
          case 'SUCCESS':             break;                                      // no problems, continue execution :)
        }

        if (skip) { continue; }

        // do the actual stuff
        if (typeof(department_spec[data.department]) === 'undefined') { department_spec[data.department] = []; }
        department_spec[data.department].push(t_mobile[i]);

        attachments.departments[data.department] = {
          email: c.findDepartmentByName(data.department).email,
          pdf_numbers: {},
          pdf_category: {},
          excel: {},
          html: []
        };
      }


      if (error) { return res.status(404).send({code: 'ERRORS'}); }               // return error if there was a serious error (number is unknown...)


      var pdf = new PDFGenerator();                                               // used to generate pdf files
      var xslx = new ExcelGenerator();                                            // used to generate excel files

      // two PDF's per department
      var totalPDF = Object.keys(department_spec).length*2;
      // one excel per department
      var totalExcel = Object.keys(department_spec).length;

      /*
           specificatie categorie (pdf)
      */
      var filenameCat = _.template(yearMonth + ' specificatie categorie <%= department %>.pdf');
      var titleCat = _.template('T-mobile specificatie totalen per categorie <%= department %>');


      for (var department in department_spec) {

        var data = {
          keys: {
            category: 'Categorie',
            costs:    'Kosten (excl. BTW)'
          },
          values: []
        };

        for (var i = 0; i < department_spec[department].length; i++) {
          for (var category in department_spec[department][i].summary.perType) {
            data.values = addToCategory(data.values, {
              category: category.toNormal(),
              costs:    department_spec[department][i].summary.perType[category].costs,
            });
          }
        }

        pdf.generate(fullPath + filenameCat({department: department}), titleCat({department: department}), data, totalPDF);
        attachments.departments[department].pdf_category = {
          filename: filenameCat({department: department}),
          path: fullPath,
          send: false
        };

      }
      /* end specificatie categorie */




      /*
           specificatie nummers (pdf)
      */
      var filenameNum = _.template(yearMonth + ' specificatie nummers <%= department %>.pdf');
      var titleNum = _.template('T-mobile specificatie totalen individueel <%= department %>');

      for (var department in department_spec) {

        var data = {
          keys: {
            number: 'Nummer',
            user:   'Gebruiker',
            costs:  'Kosten (excl. BTW)'
          },
          values: []
        };

        for (var i = 0; i < department_spec[department].length; i++) {
          data.values.push({
            number: department_spec[department][i].number,
            user: c.findUserByNumber(department_spec[department][i].number).name,
            costs: department_spec[department][i].summary.totalCosts
          })

        }

        pdf.generate(fullPath + filenameNum({department: department}), titleNum({department: department}), data, totalPDF);
        attachments.departments[department].pdf_numbers = {
          filename: filenameNum({department: department}),
          path: fullPath
        };

      }

      /* end specificatie nummers */


      /*
           specificatie personen (xlsx)
      */

      var filenamePers = _.template(yearMonth + ' specificatie personen <%= department %>.xlsx');

      for (var department in department_spec) {
        var data = [];
        for (var i = 0; i < department_spec[department].length; i++) {

          data.push({
            number: department_spec[department][i].number,
            name: c.findUserByNumber(department_spec[department][i].number).name,
            totalCosts: department_spec[department][i].summary.totalCosts,
            data: []
          })

          for (var category in department_spec[department][i].summary.perType) {
            data[data.length - 1].data.push({
              category: category.toNormal(),
              costs: department_spec[department][i].summary.perType[category].costs
            });
          }

        }

        xslx.generate(fullPath + filenamePers({department: department}), data, totalExcel);
        attachments.departments[department].excel= {
          filename: filenamePers({department: department}),
          path: fullPath
        };

      }


      /* end speficicatie personen */
      Attachments.findOne({month: month}, function(err, result) {
        if (result !== null) {
          result.remove(function(err){
            if (err) { return res.status(404).send({code: 'ERRORS'}); }               // return error if there was a serious error (number is unknown...)
            Attachments.create(attachments, function(err, result) {
              if (err) { return res.status(404).send({code: 'ERRORS'}); }               // return error if there was a serious error (number is unknown...)
              return res.json(200, {msg: 'done!', attachment: result});
            });
          });
        } else {
          Attachments.create(attachments, function(err, result) {
            console.log(err);
            if (err) { return res.status(404).send({code: 'ERRORS'}); }               // return error if there was a serious error (number is unknown...)
            return res.json(200, {msg: 'done!', attachment: result});
        });
        }

      });

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


function addToCategory(values, data) {
  for (var i = 0; i < values.length; i++) {
    if (values[i].category === data.category) {
      values[i].costs = values[i].costs + data.costs;
      return values;
    }
  }
  values.push({category: data.category, costs: data.costs});
  return values;
}
