'use strict';

describe('Directive: donut', function () {

  // load the directive's module and view
  beforeEach(module('ictsAppApp'));
  beforeEach(module('app/directives/donut/donut.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<donut></donut>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the donut directive');
  }));
});