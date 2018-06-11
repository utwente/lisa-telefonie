'use strict';

angular.module('ictsAppApp')
  .directive('myFileReader', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
        var fn = $parse(attrs.myFileReader);
        element.on('change', function(onChangeEvent) {
          var reader = new FileReader();
          reader.onload = function(onLoadEvent) {
            scope.$apply(fn(scope, {$fileContent: onLoadEvent.target.result}));
          };
          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });
      }
    };
  }]);
