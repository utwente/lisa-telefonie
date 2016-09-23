'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.post('/', passport.authenticate('ldapauth', {session: false}), function(req, res) {
  console.log('-------------------------');
  console.log(req);
  console.log('----------------------end');
  res.send({status: 'ok'});
});

module.exports = router;