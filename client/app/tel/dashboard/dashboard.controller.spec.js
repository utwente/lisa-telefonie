'use strict';

describe('Controller: TelDashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('ictsAppApp'));

  var TelDashboardCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TelDashboardCtrl = $controller('TelDashboardCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
