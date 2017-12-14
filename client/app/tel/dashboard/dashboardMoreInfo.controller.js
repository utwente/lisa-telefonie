/*jshint camelcase: false */

'use strict';

angular.module('ictsAppApp')
  .controller('DashboardMoreInfoModalCtrl', ['$scope', '$modalInstance', 'graphDataFormatter', 'month',
  function ($scope, $modalInstance, graphDataFormatter, month) {

  	$scope.date = month.date;
    $scope.costs = graphDataFormatter.getOverviewData(month.t_mobile).costs;
    $scope.options = {
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          label: x => console.log(x),
        }
      }
    };

  	$scope.close = function() {
  		$modalInstance.dismiss('cancel');
  	};

  }]);
