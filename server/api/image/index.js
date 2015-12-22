'use strict';

var express = require('express');
var controller = require('./image.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/random/:type', controller.random);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id/:userid', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);



module.exports = router;
