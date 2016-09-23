'use strict';

angular.module('ictsAppApp')
    .controller('TelKpnMonthCtrl', function($scope, $stateParams, $http, $modal, $filter, socket, ngTableParams) {

        //var yearMonth = $stateParams.monthId.split('-');
        //$scope.month = new Date(yearMonth[0], yearMonth[1]);

        $scope.month = {};
        $scope.monthLoaded = false;
        $scope.newRecord = {
            number: 1234,
            amount: '12,34'
        };

        /**
         * GET index of all available months
         */
        $http.get('/api/kpn/month/'+$stateParams.monthId).success(function(month) {
            // console.log(month);
            $scope.month = month;
            $scope.monthLoaded = true;
        });
        socket.syncUpdates('kpnMonth', $scope.month);

        // Set default sort values
        $scope.sort = {
            predicate: 'number',
            reverse: false
        };
        // Format table
        $scope.tableParams = new ngTableParams({}, {
            counts: [], // hide page counts control
        });

        /**
         * ADD
         */
        $scope.addNewRecord = function(record) {
            if (record === undefined) {
                record = $scope.newRecord;
            }
            if (record === undefined || record.number === '') {
                return;
            }
            if (record.month === undefined) {
                record.month = $scope.kpn.month;
            }
            $http.post('/api/kpn/month', {
                number: record.number,
                month: record.month,
                amount: record.amount.replace(',', '.') * 100
            }).success(function(data, status, headers, config) {
                console.log('record saved');
            }).error(function(data, status, headers, config) {
                console.log('error saving ');
            });
        };

        /**
         * UPDATE
         */
        // $scope.newNumber = {};
        // $scope.editing = false;
        // $scope.updateForm = function(record) {
        //     $scope.editing = $scope.month.numbers.indexOf(record);
        //     $scope.editing = angular.copy(record);
        //     // record.$edit = true;
        //     // record.edit = {
        //     //     number: record.number,
        //     //     amount: $filter('currency')(record.amount / 100, '').replace(/\./g, '')
        //     // };
        // };
        // See http://jsfiddle.net/Thw8n/4/
        $scope.editOriginal = {};
        $scope.editing = false;
        $scope.edit = function(record) {
            $scope.editing = $scope.month.numbers.indexOf(record);
            $scope.editOriginal = angular.copy(record);
            record.$edit = true;
        };        
        $scope.save = function(record) {
            record.amount = Math.round(record.edit.amount.replace(',', '.') * 100);
            record.number = record.edit.number;
            $http.put('/api/kpn/' + record._id, record)
                .success(function(data, status, headers, config) {
                    $scope.updateReset(record);
                    record.updated = true;
                });
        };
        $scope.reset = function(record) {
            record.edit = null;
            record.$edit = false;
        };

        /**
         * DELETE
         */
        $scope.deleteModal = function(record) {
            record.month = $scope.month.month;  // Add month
            var modalInstance = $modal.open({
                templateUrl: 'app/tel/kpn/month/kpnDelete.modal.html',
                controller: 'TelKpnDeleteModalCtrl',
                scope: $scope,
                resolve: {
                    record: function() {
                        return record;
                    }
                }
            });
            modalInstance.result.then(function() {
                $scope.deleteRecord(record);
            }, function() {
                // Dismissed
            });
        };
        $scope.deleteRecord = function(specification) {
            $http.delete('/api/kpn/month/' + specification._id)
                .success(function(data, status, header, config) {
                    // $scope.tableParams.reload();
                });
        };

        /**
         * (UN)SYNC
         */
        $scope.$on('$destroy', function() {
            socket.unsyncUpdates('kpnMonth');
        });


    });