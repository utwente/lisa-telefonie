'use strict';

var express = require('express');
var controller = require('./landline_spec.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:month', auth.isAuthenticated(), controller.show);

module.exports = router;