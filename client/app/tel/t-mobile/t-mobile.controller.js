'use strict';

angular.module('ictsAppApp')
  .controller('TelTMobileCtrl', function ($scope, $http, $modal, tMobileParser) {

    $scope.step = 'start';

    $scope.openTmobile = function($fileContent){

      // parse the file (parser is in factories/tMobileParser)
      var t_mobile = tMobileParser.parse($fileContent);

      $scope.month = t_mobile.month;
      $scope.step="loaded";
      
      // t_mobile is the input data for the donuts. 
      $scope.t_mobile = t_mobile;


    };

    $scope.saveMonth = function() {
      $scope.loading = true;
      $http.post('api/t_mobile', {
        t_mobile: $scope.t_mobile
      }).success(function (data, status, headers, config) {
        if (data.success) {
          console.log('Maand opgeslagen!');
        } else if (data.error) {
          if (data.msg == 'month_exists') {
            console.log('Maand bestaat al..');
            console.log(data);
            $scope.overrideMonthModal(data.id);
          } else {
            console.log('Onbekende fout..');
          }
        } else {
          console.log('Onbekende fout..');
        }
        $scope.loading = false;
      }).error(function (data, status, headers, config) {
        console.log('Fout bij het opslaan..');
        $scope.loading = false;
      });
    };

    $scope.updateMonth = function(id) {
      $http.put('/api/t_mobile/' + id, $scope.t_mobile)
        .success(function (data, status, headers, config) {
            console.log('Maand overschreven');
        });
    }

    $scope.overrideMonthModal = function (id) {
      var modalInstance = $modal.open({
        templateUrl: 'app/tel/t-mobile/t-mobileOverride.modal.html',
        controller: 'TMobileOverrideModalCtrl',
        scope: $scope,
        resolve: {
          id: function () {
            return id;
          }
        }
      });

      modalInstance.result.then(function (id) {
        $scope.updateMonth(id);
      }, function () {
        // Dismissed
      });
    };

  })
