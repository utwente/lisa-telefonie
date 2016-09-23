'use strict';

angular.module('ictsAppApp')
  .controller('TelCustomerEditModalCtrl', function ($scope, $modalInstance, customer) {
 
    $scope.customer = customer;
    console.log(customer);

  	$scope.delete = function () {
    	$modalInstance.close($scope.trueDelete);
  	};

  	$scope.cancel = function() {
  		$modalInstance.dismiss('cancel');
  	};

  });