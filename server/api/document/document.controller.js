'use strict';

var _ = require('lodash');
var fs = require('fs');


// Get list of documents
exports.index = function(req, res) {

  var month = req.params.month;
  var mobilePath = findMobilePath(month);
  var landlinePath = findLandlinePath(month);

  var documents = {
    landline: [],
    mobile: []
  };

  fs.readdir(mobilePath, function(err, data){
    if(err) { return handleError(res, err); }
    for (var i = data.length - 1; i >= 0; i--) {
      var file = data[i].split('.');
      documents.mobile.push({
        filename: file[0],
        extension: file[1],
        link: encodeURI('api/documents/' + month + '/mobile/' + data[i])
      })
    }

    fs.readdir(landlinePath, function(err, data){
      if(err) { return handleError(res, err); }
      for (var i = data.length - 1; i >= 0; i--) {
        var file = data[i].split('.');
        documents.landline.push({
          filename: file[0],
          extension: file[1],
          link: encodeURI('api/documents/' + month + '/landline/' + data[i])
        })
      }
      return res.status(200).json(documents);
    })

  })



};

// Get a single document
exports.show = function(req, res) {

  switch (req.params.type) {
    case 'landline': 
      var path = findLandlinePath(req.params.month);
      break;
    case 'mobile':
      var path = findMobilePath(req.params.month);
      break;
  }

  var filePath = path + req.params.filename;

  fs.readFile(filePath, function(err, data){
      if(err) { return handleError(res, err); }
      res.send(new Buffer(data, 'binary'));
  })

};


function handleError(res, err) {
  return res.status(500).send(err);
}

function findMobilePath(month) {
  var date = new Date(month);
  var monthName = date.getMonthName() + ' ' + date.getFullYear();
  var fullPath = __doc + monthName + '/mobiel/';
  return fullPath;
}

function findLandlinePath(month) {
  var date = new Date(month);
  var monthName = date.getMonthName() + ' ' + date.getFullYear();
  var fullPath = __doc + monthName + '/vast/';
  return fullPath;
}