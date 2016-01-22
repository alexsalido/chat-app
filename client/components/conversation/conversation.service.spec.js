'use strict';

describe('Service: Conversation', function () {

  // load the service's module
  beforeEach(module('chatApp'));

  // instantiate service
  var group;
  beforeEach(inject(function (_group_) {
    group = _group_;
  }));

  it('should do something', function () {
    expect(!!group).toBe(true);
  });

});
