'use strict';

angular.module('ictsAppApp')
  .filter('multiple', function () {
    return function (input, search, keys) {
        
        if (!search){return input};
        if (!keys){throw new Error('No keys given.')};

        search = search.split(' ');
        var total = search.length;

        var result = _.filter(input, function(user){
            var matches = 0;
            for (var j = 0; j < search.length; j++) {
                for (var i = keys.length - 1; i >= 0; i--) {
                    if (typeof(keys[i]) == 'object') {
                        var key = Object.keys(keys[i])[0];
                        var searchString = user[key][keys[i][key]]; 
                    } else {
                        var searchString = user[keys[i]];
                        if (searchString === undefined)
                            continue
                    }
                    if (searchString.toLowerCase().search(search[j].toLowerCase()) !== -1) {
                        matches++;
                        break;
                    }
                }
            }
            return (total == matches)
        });

        return result;
    };
  });
