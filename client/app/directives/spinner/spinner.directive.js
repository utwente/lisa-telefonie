'use strict';

angular.module('ictsAppApp')
  .directive('spinner', function () {
    return {
      templateUrl: 'app/directives/spinner/spinner.html',
      restrict: 'EA'
    };
  });
