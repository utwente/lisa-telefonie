'use strict';

describe('Controller: TelCustomerCtrl', function () {

  // load the controller's module
  beforeEach(module('ictsAppApp'));

  var TelCustomerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TelCustomerCtrl = $controller('TelCustomerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
