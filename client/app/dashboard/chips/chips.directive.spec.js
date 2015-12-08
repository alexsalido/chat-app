'use strict';

describe('Directive: chips', function () {

  // load the directive's module and view
  beforeEach(module('chatApp'));
  beforeEach(module('app/dashboard/chips/chips.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chips></chips>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the chips directive');
  }));
});