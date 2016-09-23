'use strict';

describe('Controller: TelCtrl', function () {

  // load the controller's module
  beforeEach(module('ictsAppApp'));

  var TelCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TelCtrl = $controller('TelCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
