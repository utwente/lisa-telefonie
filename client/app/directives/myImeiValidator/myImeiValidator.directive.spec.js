'use strict';

describe('Directive: myImeiValidator', function () {

  // load the directive's module
  beforeEach(module('ictsAppApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-imei-validator></my-imei-validator>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the myImeiValidator directive');
  }));
});