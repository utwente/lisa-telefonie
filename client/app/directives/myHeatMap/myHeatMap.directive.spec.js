'use strict';

describe('Directive: myHeatMap', function() {
  // load the directive's module and view
  beforeEach(module('ictsAppApp'));
  beforeEach(module('app/directives/myHeatMap/myHeatMap.html'));

  var element, scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<my-heat-map></my-heat-map>');
    element = $compile(element)(scope);
    scope.$apply();
  }));
});
