'use strict';

angular.module('ictsAppApp')

.directive('svgMap', ['$compile', '$filter', function ($compile, $filter) {
    return {

        restrict: 'A',
        templateUrl: 'app/directives/myHeatMap/img/world_map.svg',
        link: function (scope, element, attrs) {

        	var startColor = [176,204,225];
        	var endColor = [4, 33, 53];

        	var countries = scope[attrs.data];

			var min = _.min(countries, function(c){return c.amount}).amount;
			var max = _.max(countries, function(c){return c.amount}).amount;
			var diff = max - min;

        	for (var i = countries.length - 1; i >= 0; i--) {
        		
        		var code = countryCode(countries[i]);
        		var country = element[0].querySelectorAll('.' + code.toLowerCase());
				var el = angular.element(country);
				var percentage = (max - countries[i].amount)/diff;
				var color = colorMixer(startColor, endColor, percentage);
				
				el.attr("style", "fill:" + color);
        	}

        }

	}


    function countryCode(c){
      	var res = $filter('fuzzyBy')(countryList, 'name', c.name, false);
    	return res[0].code;
	}


	//colorChannelA and colorChannelB are ints ranging from 0 to 255
	function colorChannelMixer(colorChannelA, colorChannelB, amountToMix){
	    var channelA = colorChannelA*amountToMix;
	    var channelB = colorChannelB*(1-amountToMix);
	    return parseInt(channelA+channelB);
	}
	//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
	//example (red): rgbA = [255,0,0]
	function colorMixer(rgbA, rgbB, amountToMix){
	    var r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
	    var g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
	    var b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
	    return "rgb("+r+","+g+","+b+")";
	}


}]);