'use strict';

describe('Directive: spinner', function () {

  // load the directive's module and view
  beforeEach(module('ictsAppApp'));
  beforeEach(module('app/directives/spinner/spinner.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<spinner></spinner>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the spinner directive');
  }));
});