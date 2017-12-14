'use strict';

// Source: http://stackoverflow.com/questions/15242592/how-to-autocapitalize-an-input-field
angular.module('ictsAppApp')
  .directive('capitalize', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      scope: true,

      link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if (inputValue === undefined) { inputValue = ''; }
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }
            return capitalized;
         };
         modelCtrl.$parsers.push(capitalize);
         capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
     }
    };
  }]);
