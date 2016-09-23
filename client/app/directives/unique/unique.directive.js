angular.module('ictsAppApp')
  .directive('unique', ['$parse', function($parse) {
	  return {
	    require: '?ngModel',
	    link: function(scope, elm, attrs, ctrl) {

	    	ctrl.$validators.unique = function(modelValue, viewValue) {
	    		var fun = $parse(attrs.unique);
		    	var list = fun(scope);
		    	var index = _.findIndex(list, function(o) { return o[attrs.name] == modelValue; });

		    	// return true if not found (username is valid)
		    	return (index == -1)

	    	}

	    }
	  };
  }]);