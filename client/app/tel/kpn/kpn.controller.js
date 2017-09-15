'use strict';

angular.module('ictsAppApp')
    .controller('TelKpnCtrl', function($scope, $http, $modal, $filter, socket, $location, ngTableParams) {
        $scope.months = [];

        // $scope.graph = [{
        //     key: 'KPN',
        //     values: []
        // }];

        // Monthpicker settings/functions
        $scope.monthPicker = {
            today: function() {
                $scope.kpn.month = new Date();
            },
            clear: function() {
                $scope.kpn.month = null;
            },
            open: function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.monthPicker.opened = true;
            }
        };

        // Watch for changes in month
        // $scope.$watch('kpn.month', function(newValue, oldValue){
        //     if(newValue===undefined) {
        //         $location.path('/tel/kpn');
        //     }
        //     if(newValue!==oldValue) {
        //         var m = $filter('date')(newValue, 'yyyy-MM');
        //         $location.path('/tel/kpn/'+m);
        //     }
        // }, true);

        /**
         * GET index of all available months
         */
        $http.get('/api/kpn/').then(function(months) {
            // console.log(months);
            $scope.months = months.data;
            $scope.monthsLoaded = true;

            // // Format data for graph
            // angular.forEach(months, function(val, key) {
            //     $scope.graph[0].values.push([val.month, val.summary.totalCosts/1000]);
            // });
            // console.log($scope.graph);
        });
        socket.syncUpdates('kpn', $scope.months);

        /**
         * (UN)SYNC
         */
        $scope.$on('$destroy', function() {
            socket.unsyncUpdates('kpn');
        });

        /**
         * IMPORT
         */
        $scope.recordsLoaded = false;
        $scope.massImport = {
            total: 0,
            finished: 0,
            errors: 0
        };
        $scope.importRecords = function($fileContent) {
            $fileContent = $fileContent.replace(/\'/g, ''); // Remove double quotes
            $fileContent = $fileContent.replace(/\u20ac /g, ''); // Remove '€'

            var csvContent = Papa.parse($fileContent, {
                delimiter: ';'
            });

            console.log(csvContent);

            // Get months from all values
            var months = [];
            angular.forEach(csvContent.data, function(value) {
                debugger;
                // Get month from row
                var dateTime = value[1].split(' ');
                var ymd = dateTime[0].split('-');
                var month = new Date(ymd[2], ymd[1]-1, 1); // First of the month (JS months start at 0)

                // Get amount/costs
                var amount = Math.round( value[2].replace(',', '.') * 100 );

                // Get number
                var number = value[0];
                if(value[0].length===9) {
                    // 0 has been cut off (by Excel)
                    number = '0'+number;
                } else if(value[0].length===4) {

                }
                // Create month if it does not exist
                var monthId = ymd[2]+''+ymd[1];
                if(months[monthId]===undefined) {
                    months[monthId] = {
                        month: month,
                        summary: {
                            totalCosts: 0
                        },
                        numbers: []
                    };
                }

                // Add info to month
                months[monthId].month = month;
                months[monthId].summary.totalCosts += amount;
                months[monthId].numbers.push({
                    number: number,
                    amount: amount
                });               
                                
            });

            // Store months to database
            angular.forEach(months, function(month) {
                console.log('saving month');
                console.log(month);
                $http.post('api/kpn', {
                    kpn: month
                }).then(function (res) {
                    if (res.data.success) {
                      console.log('Maand opgeslagen!');
                    } else if (res.data.error) {
                      if (res.data.msg == 'month_exists') {
                        console.log('Maand bestaat al..');
                        $scope.overrideMonthModal(data.id);
                      } else {
                        console.log('Onbekende fout..');
                      }
                    } else {
                      console.log('Onbekende fout..');
                    }
                    $scope.loading = false;
                    
                }).error(function (data) {
                    console.log('Fout bij het opslaan..');
                    scope.loading = false;
                });
            });
            
        };

        // $scope.xAxisTickFormatFunction = function(){
        //     return function(d){
        //         return d3.time.format('%b')(new Date(d));
        //     };
        // };


        /**
         * Month
         */
        // Set default sort values
        $scope.sort = {
            predicate: 'number',
            reverse: false
        };
        // Format table
        $scope.tableParams = new ngTableParams({}, {
            counts: [], // hide page counts control
        });

        // Get month info
        $scope.$watch('kpn.month', function(newValue, oldValue) {
            if (newValue === undefined) {
                $location.path('/tel/kpn');
            }
            if (newValue !== oldValue) {

                /**
                 * Get month info
                 */
                $http.get('/api/kpn/' + $scope.kpn.month)
                    .then(function(month) {
                        $scope.month = month.data;
                        $scope.original = {
                            numbers: $scope.month.numbers
                        };
                    })
                    .catch(function(err) {
                        $scope.month = {
                            month: $scope.kpn.month,
                            summary: {
                                // numbers: 0,
                                totalCosts: 0,
                                // averageCosts: 0
                            },
                            numbers: []
                        };
                        $scope.original = {
                            numbers: $scope.month.numbers
                        };
                    });


            }
        }, true);


        /**
         * ADD
         */
        $scope.addNewRecord = function($record) {            
            $scope.month.numbers.push({
                number: $scope.newRecord.number,
                amount: Math.round( $scope.newRecord.amount.replace(',', '.') * 100 )
            });

            var numbers = $scope.month.summary.numbers +1;
            var totalCosts = parseInt($scope.month.summary.totalCosts) + parseInt($scope.newRecord.amount);
           	var averageCosts = Math.round( totalCosts / numbers );
			$scope.month.summary = {
            	numbers: numbers,
            	totalCosts: totalCosts,
            	averageCosts: averageCosts
            };

            if ($scope.month._id === undefined) {
                // Month is new, create
                $http.post('/api/kpn',
                    $scope.month
                ).then(function(month) {
                    $scope.month = month.data;
                    $scope.newRecord = {
                    	number: null,
                    	amount: null
                    };
                    $scope.addRecordForm.$setPristine();
                }).catch(function(err) {
                    console.log('error saving ');
                });
            } else {
                // Month is not new, update
                $http.put('/api/kpn/' + $scope.month._id, $scope.month)
                    .then(function(month) {
                    	$scope.month = month.data;
                    	$scope.newRecord = {
	                    	number: null,
	                    	amount: null
	                    };
	                    $scope.addRecordForm.$setPristine();
                    });
            }
        };


        /**
         * UPDATE
         */
        $scope.updateForm = function(record) {
            record.$edit = true;
            record.edit = {
                number: record.number,
                amount: $filter('currency')(record.amount / 100, '').replace(/\./g, '')
            };
        };
        $scope.updateRecord = function(record) {
        	record.amount = Math.round(record.edit.amount.replace(',', '.') * 100);
            record.number = record.edit.number;
            
            

            $http.put('/api/kpn/' + $scope.month._id, $scope.month)
                .then(function(month) {
                	$scope.month = month.data;
                });
        };
        $scope.updateReset = function(record) {
            record.edit = null;
            record.$edit = false;
        };


    });
