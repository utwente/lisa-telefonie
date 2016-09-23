'use strict';

describe('Service: morrisDataFormatter', function () {

  // load the service's module
  beforeEach(module('ictsAppApp'));

  // instantiate service
  var morrisDataFormatter;
  beforeEach(inject(function (_morrisDataFormatter_) {
    morrisDataFormatter = _morrisDataFormatter_;
  }));

  it('should do something', function () {
    expect(!!morrisDataFormatter).toBe(true);
  });

});
