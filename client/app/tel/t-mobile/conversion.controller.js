'use strict';

angular.module('ictsAppApp')
  .controller('conversionCtrl', function ($scope, $modalInstance, tMobileConversion) {

    $scope.step = 1;
    let dataLL;

    $scope.converse = function(data) {
      dataLL = tMobileConversion.toApp(data);
      $scope.step++;
    }

    $scope.merge = function(dataMob) {
      let dataTot = tMobileConversion.merge(dataMob, dataLL);
      $scope.step++;
      let blob = new Blob([dataTot], {type: "text/csv;charset=utf-8"});
      saveAs(blob, 'totaal.csv');
    }

  	$scope.cancel = function() {
  		$modalInstance.dismiss('cancel');
  	}

  });
