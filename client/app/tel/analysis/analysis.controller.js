'use strict';

angular.module('ictsAppApp')
   .controller('landlineAnalysis', function($scope, $http, $timeout, $filter, Morris, morrisDataFormatter) {

      var tMobile;

      $scope.start = true;

      $scope.$watch('data.month', function() {
         if (typeof $scope.data !== 'undefined') {
            $http.get('/api/t_mobile/' + $scope.data.month)
               .success(function(data) {
                  $scope.t_mobile = data;
               })
               .error(function(res) {
                  console.log('T-Mobile not found...');
               });
         }
      }, true);

      $scope.loadDetails = function(n) {
         $http.get('/api/customers/number/' + n.number).
            success(function(data){
               $scope.name = data.name;
               $scope.department = data.department.name;
            }).
            error(function(err){
               console.log(err);
            })

         // this is input data for the "donut". Donut stuff happens in app/directives/donut
         $scope.details = n;

         // this filter parses the data and adds the costs abroad (filter is in app/filters/data-abroad), moved it there to clean this part up
         $scope.dataAbroad = $filter('data_abroad')(n);

         // this filter parses the data and adds the calls abroad (filter is in app/filters/calls-abroad), moved it there to clean this part up
         $scope.callsAbroad = $filter('calls_abroad')(n);

      }

      $scope.getFile = function() {

         var month = $scope.data.month;
         var number = $scope.details.number;

         $http({
             url: 'api/calls/landline/' + month + '/' + number,
             method: 'GET',
             responseType: 'arraybuffer',
             headers: {
                 'Content-type': 'application/json',
                 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
             }
         })
         .success(function(data){
             var blob = new Blob([data], {
                 type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
             });
             saveAs(blob, 'Specificatie ' + number + '.xlsx');
         })
         .error(function(){
            console.log('Something went wrong...')
         });

      }


});
