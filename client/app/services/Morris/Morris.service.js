'use strict';

angular.module('ictsAppApp')
  .factory('Morris', function ($window) {

    if(!$window.Morris){

      console.log('Morris is not available...');

    } else {

      // add method to change the data
      $window.Morris.Donut.prototype.setData = function(data, redraw) {
        if (redraw === null) {
            redraw = true;
        }
        this.data = data;
        this.values = (function() {
        var _i, _len, _ref, _results;
        _ref = this.data;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            var row = _ref[_i];
            _results.push(parseFloat(row.value));
        }
        return _results;
        }).call(this);
        this.dirty = true;
        if (redraw) {
            return this.redraw();
        }
      };

    }

    return $window.Morris;

  });
