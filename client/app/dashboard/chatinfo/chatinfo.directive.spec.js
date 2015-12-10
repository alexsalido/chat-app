'use strict';

describe('Directive: chatInfo', function () {

  // load the directive's module and view
  beforeEach(module('chatApp'));
  beforeEach(module('app/dashboard/chatwindow/chatinfo/chatinfo.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chatinfo></chatinfo>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the chatinfo directive');
  }));
});
