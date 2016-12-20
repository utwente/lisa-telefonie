'use strict';

angular.module('ictsAppApp')
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('hvd', {
        url: '/hvd',
        templateUrl: 'app/hvd/hvd.html',
        controller: 'HvdCtrl'
      });
  }]);