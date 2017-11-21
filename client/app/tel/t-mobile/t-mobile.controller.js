'use strict';

angular.module('ictsAppApp')
  .controller('TelTMobileCtrl', function ($scope, $http, $modal, $timeout, tMobileParser) {

    $scope.step = 'start';

    $scope.openTmobile = function($fileContent){
      // parse the file (parser is in factories/tMobileParser)
      var t_mobile = tMobileParser.parse($fileContent)
      
      $scope.month = t_mobile.month;
      $scope.t_mobile = t_mobile;
      $scope.step = 'loaded';
    };

    $scope.saveMonth = function() {
      $scope.loading = true;
      $http.post('api/t_mobile', {
        t_mobile: $scope.t_mobile
      }).then(function (res) {
        if (res.data.success) {
          console.log('Maand opgeslagen!');
        } else if (res.data.error) {
          if (res.data.msg == 'month_exists') {
            console.log('Maand bestaat al..');
            $scope.overrideMonthModal(res.data.id);
          } else {
            console.log('Onbekende fout..');
          }
        } else {
          console.log('Onbekende fout..');
        }
        $scope.loading = false;
      }).catch(function (err) {
        console.log('Fout bij het opslaan..');
        $scope.loading = false;
      });
    };

    $scope.updateMonth = function(id) {
      $http.put('/api/t_mobile/' + id, $scope.t_mobile)
        .then(function (data) {
            console.log('Maand overschreven');
        });
    }

    $scope.overrideMonthModal = function (id) {
      $modal.open({
        templateUrl: 'app/tel/t-mobile/t-mobileOverride.modal.html',
        controller: 'TMobileOverrideModalCtrl',
        scope: $scope,
        resolve: {
          id: function () {
            return id;
          }
        }
      })
      .result.then(function(id) {
        $scope.updateMonth(id);
      });
    };

    $scope.openConversionTool = function() {
      console.log('Open modal!');
      $modal.open({
        templateUrl: 'app/tel/t-mobile/conversion.modal.html',
        controller: 'conversionCtrl'
      })
      .result.then(function() {
        console.log('done');
      });
    }

  })
