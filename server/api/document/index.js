'use strict';

var express = require('express');
var controller = require('./document.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:month', auth.isAuthenticated(), controller.index);
router.get('/:month/:type/:filename', auth.isAuthenticated(), controller.show);

module.exports = router;