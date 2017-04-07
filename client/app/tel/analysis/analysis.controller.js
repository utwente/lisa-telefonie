'use strict';

angular.module('ictsAppApp')
   .controller('landlineAnalysis', function($scope, $http, $timeout, $filter, Morris, morrisDataFormatter, convert) {

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
         $http.get('/api/customers/number/' + n.number)
            .success(function(data, status){
               $scope.name = data.name;
               $scope.department = data.department.name;
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

         $http.get('api/calls/landline/' + month + '/' + number, {
            headers: {
               'contentType': 'application/vnd.ms-excel'
            }
         })
         .success(function(data, status, headers){
            
            // find filename from headers
            var cont_disp = headers()['content-disposition'];
            var fileName = cont_disp.match(/filename="(.+)"/)[1];
            
            // convert base64 back
            var blob = new Blob([convert.base64ToArrayBuffer(data)], {type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

            // save file
            saveAs(blob, fileName);
            
         })
         .error(function(){
            console.log('Something went wrong...')
         });

      }


});
