'use strict';

angular.module('ictsAppApp')
  .controller('HvdImportCtrl', function ($scope, $filter, $http) {

     /**
       * IMPORT
       */
      console.log('test');

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
          var hvds = [];
          angular.forEach(csvContent.data, function(value) {
              //debugger;
              // Get hvd from row

              var ts = $.grep([value[5], value[6]], Boolean).join(" > ");

              hvds.push({
                  phoneNumber: value[0],
                  mediapack: value[1],
                  mediapackPort: value[2],
                  hvd: value[3],
                  to: value[4],
                  po: value[7],
                  location: value[8],
                  comment: $.grep([ts, value[9]], Boolean).join("\n")
              });

          });

          // Store hvds to database
          angular.forEach(hvds, function(hvd) {
              $http.post('api/hvd', hvd)
                  .success(function (data, status, headers, config) {
                      if (data.success) {
                          console.log('HVD opgeslagen!');
                      } else {
                          console.log('Onbekende fout..');
                      }
                      $scope.loading = false;

                  }).error(function (data, status, headers, config) {
                      console.log('Fout bij het opslaan..');
                      scope.loading = false;
                  });
          });

      };
    
  });
