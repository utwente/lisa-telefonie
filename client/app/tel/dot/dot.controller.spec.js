'use strict';

describe('Controller: TelDotCtrl', function () {

  // load the controller's module
  beforeEach(module('ictsAppApp'));

  var TelDotCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TelDotCtrl = $controller('TelDotCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
