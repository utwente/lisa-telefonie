/*global Papa*/

'use strict';

angular.module('ictsAppApp')
.controller('TelCustomerCtrl', function ($scope, $http, socket, ngTableParams, $modal) {

  // Pagination in controller
  $scope.currentPage = 0;
  $scope.pageSize = 50;
  $scope.setCurrentPage = function(currentPage) {
    $scope.currentPage = currentPage;
  };

  $scope.getNumberAsArray = function (num) {
    return new Array(num);
  };

  $scope.numberOfPages = function() {
    return Math.ceil($scope.filtered.length / $scope.pageSize);
  };

  $scope.$watch('search', function() {
    $scope.currentPage = 0;
  });
  // end pagination


  $scope.newCustomerAccordion = {
    open: false
  };

  $scope.customers = [];
  $scope.customersLoaded = false;

  $scope.newCustomer = {};
  $scope.newCustomer = {
    name: 'Brian',
    email: 't.est@utwente.nl',
    department: undefined,
    subdepartment: 'INFRA',
    internalAddress: 'Citadel H217',
    landlineNumber: 1234,
    shortNumber: 1234,
    mobileNumber: '0645536816',
    imeiNumber: '12345678901234',
    duoSim: false,
    internetModule: 'Internet plus plus',
    // internetActivationDate: new Date().toISOString(),
    // activationDate: new Date().toISOString(),
    phoneType: 'HTC One S',
    // employmentSince: new Date().toISOString()
  };

  $scope.date = new Date();

  $http.get('/api/customers').then(function (customers) {
    $scope.customers = customers.data;
    $scope.customersLoaded = true;
    socket.syncUpdates('customer', $scope.customers);
    // updateTable();
  });

  $http.get('/api/departments').then(function (departments) {
    $scope.departments = departments.data;
    socket.syncUpdates('department', $scope.departments);
  });


  $scope.addCustomer = function (customer) {
    var newCustomer = false;
    if (customer === undefined) {
      newCustomer = true;
      customer = $scope.newCustomer;
    } else {
      if (customer.department === undefined) { customer.department = 'UNKNOWN'; }
      var department = _.find($scope.departments, { 'name': customer.department});
      if (department === undefined) {
        throw new Error('Department "' + customer.department + '" was not found for customer "' + customer.name + '".');
      }
      customer.department = department._id;
    }


    $http.post('/api/customers', customer)
    .then(function () {
      if(newCustomer) {
        $scope.newCustomer.name = undefined;
        $scope.newCustomer.department = undefined;

        $scope.customer = {};

      }
      $scope.massImport.finished++;
    }).catch(function (err) {
      console.log('error saving customer ' + err);
      $scope.massImport.errors++;
    });

  };

  $scope.deleteCustomer = function (customer, trueDelete) {
    if (trueDelete) {
      $http.delete('/api/customers/' + customer._id)
      .then(function(){
        $scope.customers.splice(_.findIndex($scope.customers, customer), 1);
      });
    } else {
      $http.delete('/api/customers/' + customer._id + '/deactivate')
      .then(function(){
        $scope.customers.splice(_.findIndex($scope.customers, customer), 1);
      });
    }
  };

  $scope.updateCustomer = function(customer){
    $http.put('/api/customers/' + customer._id, customer)
    .then(function(data){
      console.log(data.data);
    });
  };


  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('customer');
  });

  /**
  * Date pickers
  */
  // Global
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  // activationDatePicker
  $scope.internetActivationDatePicker = {
    today: function () {
      $scope.newCustomer.internetActivationDate = new Date().toISOString();
    },
    clear: function () {
      $scope.newCustomer.internetActivationDate = null;
    },
    open: function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.internetActivationDatePicker.opened = true;
    }
  };
  // $scope.internetActivationDatePicker.today();

  // activationDatePicker
  $scope.activationDatePicker = {
    today: function () {
      $scope.newCustomer.activationDate = new Date().toISOString();
    },
    clear: function () {
      $scope.newCustomer.activationDate = null;
    },
    open: function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.activationDatePicker.opened = true;
    }
  };
  $scope.activationDatePicker.today();

  // activationDatePicker
  $scope.employmentSincePicker = {
    today: function () {
      $scope.newCustomer.employmentSince = new Date().toISOString();
    },
    clear: function () {
      $scope.newCustomer.employmentSince = null;
    },
    open: function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.employmentSincePicker.opened = true;
    }
  };
  // $scope.employmentSincePicker.today();




  $scope.deleteCustomerModal = function (customer) {
    var modalInstance = $modal.open({
      templateUrl: 'app/tel/customer/customerDelete.modal.html',
      controller: 'TelCustomerDeleteModalCtrl',
      scope: $scope,
      resolve: {
        customer: function () {
          return customer;
        }
      }
    });

    modalInstance.result.then(function (trueDelete) {
      $scope.deleteCustomer(customer, trueDelete);
    }, function () {
      // Dismissed
    });
  };

  $scope.addEditCustomer = function (customer) {
    var modalInstance = $modal.open({
      templateUrl: 'app/tel/customer/customerEdit.modal.html',
      controller: 'TelCustomerEditModalCtrl',
      scope: $scope,
      resolve: {
        customer: function () {
          return customer;
        }
      }
    });

    modalInstance.result.then(function (customer) {
      $scope.updateCustomer(customer);
    }, function () {
      // Dismissed
    });
  };


  $scope.massImport = {
    total: 0,
    finished: 0,
    errors: 0
  };

  function stringToDate(s)  {
    s = s.split(/[-: ]/);
    return new Date(s[2], s[1] - 1, s[0]);
  }

  $scope.openUsers = function($fileContent) {
    $fileContent = $fileContent.replace(/\"/g, '').replace(/,00/g,'');
    var lines = $fileContent.split('\n');
    lines.splice(lines.length - 1, 1);
    var csv = lines.join('\n');
    var csvContent = Papa.parse(csv, {delimiter: ';'});

    var users = [];
    var user;
    for (var i = 0; i < csvContent.data.length; i++) {

      user = csvContent.data[i];

      users[i] = {};
      users[i].active = true;
      if (user[2] !== '') { users[i].name = user[2]; }
      if (user[7] !== '') { users[i].email = user[7]; }
      if (user[3] !== '') { users[i].department = user[3]; }
      if (user[4] !== '') { users[i].subdepartment = user[4]; }
      if (user[5] !== '') { users[i].internalAddress = user[5]; }
      if (user[6] !== '') { users[i].landlineNumber = user[6]; }
      if (user[0] !== '') { users[i].shortNumber = user[0]; }
      if (user[1] !== '') { users[i].mobileNumber = '0' + user[1]; }
      if (user[13] !== '') { users[i].imeiNumber = user[13]; }
      if (user[8] !== '') { users[i].duoSim = (user[8] === '1'); }
      if (user[9] !== '') { users[i].internetModule = (user[9] === '1'); }
      if (user[17] !== '') {
        users[i].comments = [];
        users[i].comments.push(user[17]);
      }
      if (user[11] !== '') { users[i].activationDate = stringToDate(user[11]); }
      if (user[10] !== '') { users[i].phoneType = user[10]; }
    }

    $scope.massImport.total = users.length;
    for(var x=0; x<users.length; x++) {
      $scope.addCustomer(users[x]);
    }

  };

});
