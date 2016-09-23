'use strict';

angular.module('ictsAppApp')

    .controller('DataCtrl', function ($scope, $http) {

        $scope.$watch('data.month', function() {
            if (typeof $scope.data !== 'undefined') {
                $http.get('/api/t_mobile/' + $scope.data.month)
                    .success(function(tMobile) {
                        $scope.makeDataCSV(tMobile);
                    })
                    .error(function(res) {
                        console.log('T-Mobile not found...');
                    });
            }
        }, true);

        $scope.makeDataCSV = function(tMobile) {

            var csvContent = 'data:text/csv;content=utf-8,';

            for (var number in tMobile.numbers) {
                if (tMobile.numbers[number].summary.perType.internet !== undefined) {
                    csvContent = csvContent + tMobile.numbers[number].number + ';';
                    csvContent = csvContent + tMobile.numbers[number].summary.perType.internet.data + ';' ;
                    csvContent = csvContent + tMobile.numbers[number].summary.perType.internet.costs + '\n';
                }
            };

            // download CSV file (works only in Chrome?)
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'Data.csv');
            link.click(); 
        }

  });
