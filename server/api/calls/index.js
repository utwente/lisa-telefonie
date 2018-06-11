'use strict';

var express = require('express');
var controller = require('./calls.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// set this back to authenticated!!!
router.get('/:type/:month/:number', controller.show);
// router.get('/:type/:month/:number', auth.isAuthenticated(), controller.show);

module.exports = router;