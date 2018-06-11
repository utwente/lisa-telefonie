'use strict';

var express = require('express');
var controller = require('./customer.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
// router.post('/mass', auth.isAuthenticated(), controller.massCreate);
router.get('/department/:department', auth.isAuthenticated(), controller.byDepartment);
router.get('/number/:number', auth.isAuthenticated(), controller.byNumber);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.delete('/:id/deactivate', auth.isAuthenticated(), controller.trash);

module.exports = router;