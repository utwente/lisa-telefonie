'use strict';

angular.module('ictsAppApp')
  .controller('SettingsCtrl', ['$scope', 'User', 'Auth', function ($scope, User, Auth) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Nieuw wachtwoord opgeslagen.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Fout wachtwoord';
          $scope.message = '';
        });
      }
		};
  }]);
