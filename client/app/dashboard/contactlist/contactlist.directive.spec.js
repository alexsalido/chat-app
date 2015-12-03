'use strict';

describe('Directive: contactList', function () {

  // load the directive's module and view
  beforeEach(module('chatApp'));
  beforeEach(module('app/dashboard/contactlist/contactlist.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<contactlist></contactlist>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the contactlist directive');
  }));
});
