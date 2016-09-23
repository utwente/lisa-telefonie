'use strict';

angular.module('ictsAppApp')
	.controller('TelKpnDeleteModalCtrl', function ($scope, $modalInstance, record) {
		$scope.record = record;

		$scope.delete = function () {
			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	});