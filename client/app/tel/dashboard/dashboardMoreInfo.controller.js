'use strict';

angular.module('ictsAppApp')
  .controller('DashboardMoreInfoModalCtrl', function ($scope, $modalInstance, $timeout, Morris, month) {

  	$scope.date = month.date;
  	
  	// input data for the donut
  	$scope.t_mobile = month.t_mobile;

  	$scope.close = function() {
  		$modalInstance.dismiss('cancel');
  	};

  });