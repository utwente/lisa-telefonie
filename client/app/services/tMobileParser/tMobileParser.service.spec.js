'use strict';

describe('Service: tMobileParser', function () {

  // load the service's module
  beforeEach(module('ictsAppApp'));

  // instantiate service
  var tMobileParser;
  beforeEach(inject(function (_tMobileParser_) {
    tMobileParser = _tMobileParser_;
  }));

  it('should do something', function () {
    expect(!!tMobileParser).toBe(true);
  });

});
