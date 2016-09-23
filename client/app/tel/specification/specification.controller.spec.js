'use strict';

describe('Controller: TelSpecificationCtrl', function () {

  // load the controller's module
  beforeEach(module('ictsAppApp'));

  var TelSpecificationCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TelSpecificationCtrl = $controller('TelSpecificationCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
