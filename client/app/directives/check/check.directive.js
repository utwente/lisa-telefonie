'use strict';

angular.module('ictsAppApp')
  .directive('check', ['$parse', function($parse) {
	  return {
	    require: '?ngModel',
	    link: function(scope, elm, attrs, ctrl) {

	    	ctrl.$validators.integer = function() {
		    	var fun = $parse(attrs.check);
		    	return fun(scope);
	    	};

	    }
	  };
  }]);
