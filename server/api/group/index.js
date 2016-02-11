'use strict';

var express = require('express');
var controller = require('./group.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id/name', auth.isAuthenticated(), controller.name);
router.put('/:id/participant/add', auth.isAuthenticated(), controller.addParticipants);
router.put('/:id/participant/remove', auth.isAuthenticated(), controller.removeParticipant);
router.put('/:id/message', auth.isAuthenticated(), controller.message);

module.exports = router;
