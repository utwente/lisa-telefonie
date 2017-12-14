/*jshint -W083 */
/*global saveAs */

'use strict';

angular.module('ictsAppApp')
.controller('TelDotCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter) {

  function resetProgress() {
    $scope.progress = {
      total: 3,
      done: 0,
      errors: false,
      track: {
        kpn: false,
        tMobile: false,
        output: false
      },
      error: {
        kpn: false,
        tMobile: false,
        output: false
      }
    };
  }
  resetProgress();


  function makeCSV(tMobile, kpn, month) {
    var mLastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    var monthDOT = $filter('date')(mLastDay, 'dd-MM-yyyy', 'CET');
    var csvContent = '';

    // first put into array to check later if there are double numbers.
    var csvArray = [];

    for (let i = tMobile.numbers.length - 1; i >= 0; i--) {
      csvArray.push({
        number: '+31' + tMobile.numbers[i].number.substr(1),
        month: monthDOT,
        costs: Math.round(tMobile.numbers[i].summary.totalCosts)
      });
    }

    // KPN
    for (let i = kpn.numbers.length - 1; i >= 0; i--) {
      var number = (kpn.numbers[i].number.size === 4) ? kpn.numbers[i].number : '+31' + kpn.numbers[i].number.substr(1);
      csvArray.push({
        number: number,
        month: monthDOT,
        costs: Math.round(kpn.numbers[i].amount)
      });
    }

    // check for double numbers...
    for (let i = csvArray.length - 1; i >= 0; i--) {
      _.remove(csvArray, function(p, j){
        // check if number is the same, but different index --> double!
        if (csvArray[i].number === p.number && i !== j) {
          csvArray[i].costs += p.costs;
          return true;
        }
        return false;
      });
    }

    var line;
    for (let i = 0; i < csvArray.length; i++) {
      line = csvArray[i].number + ';' + csvArray[i].month + ';' + csvArray[i].costs;
      // strip all characters that are not numbers or ;+- all other characters cause a problem
      line = line.replace(/[^0-9|;|\-|\+]/,'');
      csvContent += line + '\n';
    }

    $scope.progress.done++;

    var filename = 'DOT_' + monthDOT + '.csv';
    var blob = new Blob([csvContent], {type: 'text/csv'});

    // function from FileSaver.js
    saveAs(blob, filename);

    $scope.progress.track.output = true;

  }

  $scope.$watch('dot.month', function() {

    if (typeof $scope.dot !== 'undefined') {
      /**
      * Reset progress
      */
      resetProgress();

      /**
      * Get month info
      */
      var month = new Date($scope.dot.month); // remember month for csv file name

      $http.get('/api/t_mobile/' + $scope.dot.month)
      .then(function(tMobile) {
        $scope.progress.done++;
        $scope.progress.track.tMobile = true;
        $http.get('/api/kpn/' + $scope.dot.month)
        .then(function(kpn) {
          $scope.progress.done++;
          $scope.progress.track.kpn = true;
          makeCSV(tMobile.data, kpn.data, month);
          $scope.progress.done++;
        })
        .catch(function() {
          $scope.progress.errors = true;
          $scope.progress.error.kpn = true;
        });
      })
      .catch(function() {
        $scope.progress.errors = true;
        $scope.progress.error.tMobile = true;
      });
    }
  }, true);


}]);
