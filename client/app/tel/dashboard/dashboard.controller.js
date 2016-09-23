'use strict';

angular.module('ictsAppApp')
  .controller('TelDashboardCtrl', function ($scope, $http, $timeout, $modal, Morris, morrisDataFormatter) {
    
    var today = new Date();
    var month = today.getMonth();
    var year = today.getFullYear();

    $http.get('/api/stats',{ params: {
      numbers : 10, 
      min_date: new Date(year, month - 12), 
      max_date: new Date(year, month)
    }})
    .success(function(months) {

      var monthData = {};

      // --------------------------
      //      T-mobile part
      // --------------------------

      var data = morrisDataFormatter.getDashboardData(months);
      
      // --------------------------
      //      Display part
      // --------------------------
      $scope.showResults = true;
      $timeout(function(){

        Morris.Line({
          element: 'overview-graph',
          data: data.overview,
          xkey: data.xkey,
          ykeys: data.ykeys,
          labels: data.labels,
          hoverCallback: function (index, options, content, row) {
            return content + '<div class="more-info">Klik voor meer informatie.</div>';
          }
        })
        .on('click', function(i, row){
          $scope.moreInfoModal({
            t_mobile: months.t_mobile[i],
            date: data.date[i]
          });
        });

      });
  });

  $scope.moreInfoModal = function (month) {
    var modalInstance = $modal.open({
      templateUrl: 'app/tel/dashboard/dashboardMoreInfo.modal.html',
      controller: 'DashboardMoreInfoModalCtrl',
      scope: $scope,
      resolve: {
        month: function () {
          return month;
        }
      }
    });

    modalInstance.result.then(function () {
      // 
    }, function () {
      // Dismissed
    });
  };

});
