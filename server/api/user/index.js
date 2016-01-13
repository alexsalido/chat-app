'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
// router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/email', auth.isAuthenticated(), controller.changeEmail);
router.put('/:id/status', auth.isAuthenticated(), controller.changeStatus);
router.put('/:id/request', auth.isAuthenticated(), controller.sendFriendRequest);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/email/:email', auth.isAuthenticated(), controller.isRegistered)
router.post('/', controller.create);

module.exports = router;
