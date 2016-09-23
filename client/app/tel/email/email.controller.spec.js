'use strict';

describe('Controller: EmailCtrl', function () {

  // load the controller's module
  beforeEach(module('ictsAppApp'));

  var EmailCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmailCtrl = $controller('EmailCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
