'use strict';

describe('Filter: multiple', function () {

  // load the filter's module
  beforeEach(module('ictsAppApp'));

  // initialize a new instance of the filter before each test
  var multiple;
  beforeEach(inject(function ($filter) {
    multiple = $filter('multiple');
  }));

  it('should return the input prefixed with "multiple filter:"', function () {
    var text = 'angularjs';
    expect(multiple(text)).toBe('multiple filter: ' + text);
  });

});
