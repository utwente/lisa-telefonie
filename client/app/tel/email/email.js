'use strict';

angular.module('ictsAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('email', {
        url: '/email',
        templateUrl: 'app/tel/email/email.html',
        controller: 'EmailCtrl'
      });
  });