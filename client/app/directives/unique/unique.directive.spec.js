'use strict';

describe('Directive: unique', function () {

  // load the directive's module
  beforeEach(module('ictsAppApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<unique></unique>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the unique directive');
  }));
});