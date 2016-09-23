'use strict';

describe('Filter: dataAbroad', function() {
  // load the filter's module
  beforeEach(module('ictsAppApp'));

  // initialize a new instance of the filter before each test
  var dataAbroad;
  beforeEach(inject(function($filter) {
    dataAbroad = $filter('dataAbroad');
  }));

  it('should return the input prefixed with "dataAbroad filter:"', function() {
    var text = 'angularjs';
  });
});
