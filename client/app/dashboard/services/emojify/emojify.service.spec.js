'use strict';

describe('Service: emojify', function () {

  // load the service's module
  beforeEach(module('chatApp'));

  // instantiate service
  var emojify;
  beforeEach(inject(function (_emojify_) {
    emojify = _emojify_;
  }));
});
