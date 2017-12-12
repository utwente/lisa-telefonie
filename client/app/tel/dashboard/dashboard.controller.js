/*jshint camelcase: false */

'use strict';

angular.module('ictsAppApp')
.controller('TelDashboardCtrl', function ($scope, $http, $modal, $filter, graphDataFormatter) {

  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  const moreInfoModal = (month) => {
    $modal.open({
      templateUrl: 'app/tel/dashboard/dashboardMoreInfo.modal.html',
      controller: 'DashboardMoreInfoModalCtrl',
      scope: $scope,
      resolve: {
        month: () => month
      }
    })
    .result.then((res) => console.log(res), (err) => console.log(err));
  };

  $http.get('/api/stats',{ params: {
    numbers : 10,
    min_date: new Date(year, month - 12),
    max_date: new Date(year, month)
  }})
  .then(function(months) {
    $scope.showResults = true;
    $scope.overview  = graphDataFormatter.getDashboardData(months.data);
    $scope.click = (e) => moreInfoModal({
      t_mobile: months.data.t_mobile[e[0]._index],
      date: $scope.overview.labels[e[0]._index]
    });

    $scope.options = {
      maintainAspectRatio: false,
      scales: {yAxes: [
        {
          ticks: {
            min: 0,
            callback: x => $filter('currency')(x/100, '€'),
          }
        }
      ],
      xAxes: [
        {
          ticks: {
            min: 0,
            callback: d => $filter('date')(d, 'MM-yyyy'),
          }
        }
      ]},
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          label: x => $filter('currency')(x.yLabel/100, '€'),
        }
      }
    };
  });

});
