'use strict';

angular.module('ictsAppApp')
  .controller('NavbarCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
    $scope.menu = [
    {
      'icon': 'fa-euro',
      'title': 'Doorberekening',
      'link': '/tel'
    },
    {
      'icon': 'fa-tty',
      'title': 'HVD bestand',
      'link': '/hvd'
    }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      var path = $location.path().split('/');
      path.shift();
      return (route === '/'+path[0] || route === '/'+path.join('/'));
    };
  }]);