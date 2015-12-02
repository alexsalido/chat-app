'use strict';

describe('Directive: chatList', function () {

  // load the directive's module and view
  beforeEach(module('chatApp'));
  beforeEach(module('app/dashboard/chatlist/chatlist.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chatlist></chatlist>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the chatlist directive');
  }));
});
