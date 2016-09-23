'use strict';

describe('Directive: myFileReader', function () {

  // load the directive's module
  beforeEach(module('ictsAppApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-file-reader></my-file-reader>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the myFileReader directive');
  }));
});