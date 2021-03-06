'use strict';

angular.module('ictsAppApp')
  .controller('HvdEditModalCtrl', ['$scope', '$modalInstance', 'hvd', '$http', function ($scope, $modalInstance, hvd, $http) {

    $scope.hvd = hvd;

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function() {
        if (hvd === undefined || hvd.phoneNumber === '') {
            return;
        }

        if(hvd.phoneNumber.length === 4) {
            hvd.phoneNumber = '3153489' + hvd.phoneNumber;
        }
        $http.put('/api/hvd/'+ hvd._id, {
            phoneNumber: hvd.phoneNumber,
            mediapack: hvd.mediapack,
            mediapackPort: hvd.mediapackPort,
            hvd: hvd.hvd,
            to: hvd.to,
            po: hvd.po,
            location: hvd.location,
            comment: hvd.comment
        }).success(function () {
            $modalInstance.dismiss('cancel');
        }).error(function () {
            console.log('error saving ');
        });
    };

  }]);
