'use strict';

angular.module('ictsAppApp')
  .controller('TelCustomerDeleteModalCtrl', function ($scope, $modalInstance, customer) {
  	$scope.trueDelete = false;
  	$scope.hideMoreOptions = true;
    $scope.customer = customer;

  	// Global    
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.deleteCustomer = {};

    console.log($scope);

    // activationDatePicker
    $scope.deactivationDatePicker = {
      today: function() {
        $scope.deleteCustomer.deactivationDate = new Date().toISOString();
      },
      clear: function () {
        $scope.deleteCustomer.deactivationDate = null;
      },
      open: function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.deactivationDatePicker.opened = true;
      }
    };
    $scope.deactivationDatePicker.today();

  	$scope.delete = function () {
    	$modalInstance.close($scope.trueDelete);
  	};

  	$scope.cancel = function() {
  		$modalInstance.dismiss('cancel');
  	};

  });