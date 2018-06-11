/*jshint bitwise: false*/
'use strict';

angular.module('ictsAppApp')
.directive('imei', [function () {

  var helpers = {
    /**
    * Implement Luhn validation algorithm
    * Credit to https://gist.github.com/ShirtlessKirk/2134376
    *
    * @see http://en.wikipedia.org/wiki/Luhn
    * @param {String} value
    * @returns {Boolean}
    */
    luhn: function(value) {
      var length  = value.length,
      mul     = 0,
      prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]],
      sum     = 0;

      while (length--) {
        sum += prodArr[mul][parseInt(value.charAt(length), 10)];
        mul ^= 1;
      }
      return (sum % 10 === 0 && sum > 0);
    }
  };

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {

      ctrl.$validators.myImei = function(modelValue, viewValue) {
        /**
        * Validate IMEI (International Mobile Station Equipment Identity)
        * Examples:
        * - Valid: 35-209900-176148-1, 35-209900-176148-23, 3568680000414120, 490154203237518
        * - Invalid: 490154203237517
        *
        * @see http://en.wikipedia.org/wiki/International_Mobile_Station_Equipment_Identity
        * @param {BootstrapValidator} validator The validator plugin instance
        * @param {jQuery} $field Field element
        * - message: The invalid message
        * @returns {Boolean}
        */
        function validateImei(value) {
          if (value === '') {
            return true;
          }
          switch (true) {
            case /^\d{15}$/.test(value):
            case /^\d{2}-\d{6}-\d{6}-\d{1}$/.test(value):
            case /^\d{2}\s\d{6}\s\d{6}\s\d{1}$/.test(value):
            value = value.replace(/[^0-9]/g, '');
            return helpers.luhn(value);

            case /^\d{14}$/.test(value):
            case /^\d{16}$/.test(value):
            case /^\d{2}-\d{6}-\d{6}(|-\d{2})$/.test(value):
            case /^\d{2}\s\d{6}\s\d{6}(|\s\d{2})$/.test(value):
            return true;

            default:
            return false;
          }
        }

        var validity = validateImei(viewValue);
        ctrl.$setValidity('imei', validity);
        return validity;
      };
    }

  };
}]);
