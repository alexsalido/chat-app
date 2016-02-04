'use strict';

var express = require('express');
var controller = require('./conversation.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id/add', controller.addToUser);
router.put('/:id/delete', controller.deleteFromUser);
router.put('/:id/message', controller.message);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
