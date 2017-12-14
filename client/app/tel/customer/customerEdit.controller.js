'use strict';

angular.module('ictsAppApp')
  .controller('TelCustomerEditModalCtrl', ['$scope', '$modalInstance', 'customer',
  function($scope, $modalInstance, customer) {

    $scope.customer = customer;

  	$scope.save = function () {
    	$modalInstance.close($scope.customer);
  	};

  	$scope.cancel = function() {
  		$modalInstance.dismiss('cancel');
  	};

  }]);
