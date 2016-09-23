'use strict';

describe('Directive: landlineAnalysis', function () {

  // load the directive's module and view
  beforeEach(module('ictsAppApp'));
  beforeEach(module('app/tel/landline_analysis/landline_analysis.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<landline-analysis></landline-analysis>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the landlineAnalysis directive');
  }));
});