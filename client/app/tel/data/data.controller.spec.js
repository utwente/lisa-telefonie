'use strict';

describe('Controller: DataCtrl', function () {

  // load the controller's module
  beforeEach(module('ictsAppApp'));

  var DataCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DataCtrl = $controller('DataCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
