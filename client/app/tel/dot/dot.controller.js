'use strict';

angular.module('ictsAppApp')
    .controller('TelDotCtrl', function($scope, $http, $filter) {

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
                        .success(function(tMobile) {
                            

                            $scope.progress.done++;
                            $scope.progress.track.tMobile = true;

                            $http.get('/api/kpn/' + $scope.dot.month)
                                .success(function(kpn) {

                                    $scope.progress.done++;
                                    $scope.progress.track.kpn = true;

                                    if ($scope.makeCSV(tMobile, kpn, month)) {
                                        $scope.progress.done++;
                                    }

                                })
                                .error(function(res) {
                                    $scope.progress.errors = true;
                                    $scope.progress.error.kpn = true;
                                    console.log('KPN not found...');
                                });
                        })
                        .error(function(res) {
                            $scope.progress.errors = true;
                                    $scope.progress.error.tMobile = true;
                            console.log('T-Mobile not found...');
                        });
            }
        }, true);



        $scope.makeCSV = function(tMobile, kpn, month) {
            var mLastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
            var monthDOT = $filter('date')(mLastDay, 'dd-MM-yyyy', 'CET');
            var csvContent = '';

            console.log('Lenght tMobile: ' + tMobile.numbers.length);

            for (var i = tMobile.numbers.length - 1; i >= 0; i--) {
                csvContent += '+31' + tMobile.numbers[i].number.substr(1) + ';' + monthDOT + ';' + (Math.round(tMobile.numbers[i].summary.totalCosts)) + '\n';
            }

            // KPN
            for (var i = kpn.numbers.length - 1; i >= 0; i--) {
                var number = (kpn.numbers[i].number.size == 4) ? kpn.numbers[i].number : '+31' + kpn.numbers[i].number.substr(1);
                csvContent += number + ';' + monthDOT + ';' + (Math.round(kpn.numbers[i].amount)) + '\n';
            }

            $scope.progress.done++;

            var filename = 'DOT_' + monthDOT + '.csv';
            var blob = new Blob([csvContent], {type: "text/csv;charset=utf-8"});

            // function from FileSaver.js
            saveAs(blob, filename);

            $scope.progress.track.output = true;

            return true;
        };


    });
