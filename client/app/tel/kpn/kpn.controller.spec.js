'use strict';

describe('Controller: TelKpnCtrl', function () {

  // load the controller's module
  beforeEach(module('ictsAppApp'));

  var TelKpnCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TelKpnCtrl = $controller('TelKpnCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
