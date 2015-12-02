'use strict';

describe('Directive: chatWindow', function () {

  // load the directive's module and view
  beforeEach(module('chatApp'));
  beforeEach(module('app/dashboard/chatwindow/chatwindow.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chatwindow></chatwindow>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the chatwindow directive');
  }));
});
