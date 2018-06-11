'use strict';

angular.module('ictsAppApp')
  .controller('TMobileOverrideModalCtrl', ['$scope', '$modalInstance', 'id', function ($scope, $modalInstance, id) {

    $scope.id = id;

  	$scope.update = function () {
    	$modalInstance.close(id);
  	};

  	$scope.cancel = function() {
  		$modalInstance.dismiss('cancel');
  	};

  }]);
