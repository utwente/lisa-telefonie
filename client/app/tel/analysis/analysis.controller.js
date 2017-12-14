/*jshint camelcase: false */
/* global saveAs*/

'use strict';

angular.module('ictsAppApp')
.controller('landlineAnalysis', function($scope, $http, $timeout, $filter, graphDataFormatter, convert, message) {
  $scope.start = true;

  const formatter = (labelfun) =>
    (event, data) => {
      const ix = event.index;
      const text = data.labels[ix];
      const val = data.datasets[0].data[ix];
      return `${text}: ${labelfun(val)}`;
    };

  const optionsGenerator = (labelfun) => (
    {
      tooltips: {
        mode: 'label',
        callbacks: {
          label: formatter(labelfun),
        }
      }
    }
  );

  function showDonut(res) {
    $scope.t_mobile = res.data;
    const data = graphDataFormatter.getOverviewData($scope.t_mobile);
    $scope.costs = data.costs;
    $scope.costs.options = optionsGenerator(data.costs.formatter);
  }

  $scope.$watch('data.month', function() {
    if (typeof $scope.data !== 'undefined') {
      $http.get('/api/t_mobile/' + $scope.data.month)
      .then(showDonut)
      .catch(function() {
        message.error('Het ophalen van deze maand is niet gelukt. Is deze maand al ingevoerd?');
      });
    }
  }, true);

  $scope.loadDetails = function(n) {
    $http.get('/api/customers/number/' + n.number)
    .then(function(user){
      $scope.name = user.data.name;
      $scope.department = user.data.department.name;
    });

    // this is input data for the "donut". Donut stuff happens in app/directives/donut
    const data = graphDataFormatter.getPersonalData(n);
    $scope.personal = data;
    $scope.personal.options = optionsGenerator(data.formatter);

    // this filter parses the data and adds the costs abroad (filter is in app/filters/data-abroad), moved it there to clean this part up
    $scope.dataAbroad = $filter('data_abroad')(n);

    // this filter parses the data and adds the calls abroad (filter is in app/filters/calls-abroad), moved it there to clean this part up
    $scope.callsAbroad = $filter('calls_abroad')(n);

  };

  $scope.getFile = function() {

    var month = $scope.data.month;
    var number = $scope.details.number;

    $http.get('api/calls/landline/' + month + '/' + number, {
      headers: {
        'contentType': 'application/vnd.ms-excel'
      }
    })
    .then(function(file){

      // find filename from headers
      var cont_disp = file.headers()['content-disposition'];
      var fileName = cont_disp.match(/filename="(.+)"/)[1];

      // convert base64 back
      var blob = new Blob([convert.base64ToArrayBuffer(file.data)], {type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

      // save file
      saveAs(blob, fileName);

    })
    .catch(function(){
      message.error('Bestand kon niet opgehaald worden...');
    });

  };

});
