'use strict';

describe('Filter: callsAbroad', function() {
  // load the filter's module
  beforeEach(module('ictsAppApp'));

  // initialize a new instance of the filter before each test
  var callsAbroad;
  beforeEach(inject(function($filter) {
    callsAbroad = $filter('callsAbroad');
  }));

  it('should return the input prefixed with "callsAbroad filter:"', function() {
    var text = 'angularjs';
  });
});
