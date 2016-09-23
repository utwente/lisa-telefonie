'use strict';

describe('Service: Morris', function () {

  // load the service's module
  beforeEach(module('ictsAppApp'));

  // instantiate service
  var Morris;
  beforeEach(inject(function (_Morris_) {
    Morris = _Morris_;
  }));

  it('should do something', function () {
    expect(!!Morris).toBe(true);
  });

});
