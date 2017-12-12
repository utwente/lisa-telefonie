/*jshint camelcase: false */

'use strict';

angular.module('ictsAppApp')
  .controller('TelTMobileCtrl', function ($scope, $http, $modal, $timeout, tMobileParser, graphDataFormatter) {

    const formatter = (labelfun) =>
      (event, data) => {
        const ix = event.index;
        const text = data.labels[ix];
        const val = data.datasets[0].data[ix];
        return `${text}: ${labelfun(val)}`;
      }

    const optionsGenerator = (labelfun) => (
      {
        tooltips: {
          mode: 'label',
          callbacks: {
            label: formatter(labelfun),
          }
        }
      }
    );

    $scope.step = 'start';

    function showDonuts(t_mobile) {
      const data = graphDataFormatter.getOverviewData(t_mobile);
      $scope.costs = data.costs;
      $scope.costs.options = optionsGenerator(data.costs.formatter);
      $scope.time = data.time;
      $scope.time.options = optionsGenerator(data.time.formatter);
      $scope.sms = data.sms;
      $scope.sms.options = optionsGenerator(data.sms.formatter);
      $scope.data = data.data;
      $scope.data.options = optionsGenerator(data.data.formatter);
    }

    $scope.openTmobile = function($fileContent){
      // parse the file (parser is in factories/tMobileParser)
      var t_mobile = tMobileParser.parse($fileContent);

      $scope.month = t_mobile.month;
      $scope.t_mobile = t_mobile;
      $scope.step = 'loaded';

      showDonuts(t_mobile);

    };



    $scope.saveMonth = function() {
      $scope.loading = true;
      $http.post('api/t_mobile', {
        t_mobile: $scope.t_mobile
      }).then(function (res) {
        if (res.data.success) {
          console.log('Maand opgeslagen!');
        } else if (res.data.error) {
          if (res.data.msg === 'month_exists') {
            console.log('Maand bestaat al..');
            $scope.overrideMonthModal(res.data.id);
          } else {
            console.log('Onbekende fout..');
          }
        } else {
          console.log('Onbekende fout..');
        }
        $scope.loading = false;
      }).catch(function () {
        console.log('Fout bij het opslaan..');
        $scope.loading = false;
      });
    };

    $scope.updateMonth = function(id) {
      $http.put('/api/t_mobile/' + id, $scope.t_mobile)
        .then(function () {
            console.log('Maand overschreven');
        });
    };

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
    };

  });
