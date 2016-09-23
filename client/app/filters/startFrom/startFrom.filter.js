'use strict';

angular.module('ictsAppApp')
  .filter('startFrom', function () {
    return function(input, start) {         
        return input.slice(start);
    };
  });