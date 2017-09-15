'use strict';

angular.module('ictsAppApp')

    .controller('DataCtrl', function ($scope, $http) {

        $scope.$watch('data.month', function() {
            if (typeof $scope.data !== 'undefined') {
                $http.get('/api/t_mobile/' + $scope.data.month)
                    .then(function(tMobile) {
                        $scope.makeDataCSV(tMobile.data);
                    })
                    .catch(function(err) {
                        console.log('T-Mobile not found...');
                    });
            }
        }, true);

        $scope.makeDataCSV = function(tMobile) {

            var csvContent = '';

            for (var number in tMobile.numbers) {
                if (tMobile.numbers[number].summary.perType.internet !== undefined) {
                    csvContent = csvContent + tMobile.numbers[number].number + ';';
                    csvContent = csvContent + tMobile.numbers[number].summary.perType.internet.data + ';' ;
                    csvContent = csvContent + tMobile.numbers[number].summary.perType.internet.costs + '\n';
                }
            };

            // download CSV file
            var filename = 'Data.csv';
            var blob = new Blob([csvContent], {type: "text/csv;charset=utf-8"});

            // function from FileSaver.js
            saveAs(blob, filename);
        }

  });
