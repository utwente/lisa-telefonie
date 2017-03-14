'use strict';

angular.module('ictsAppApp')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('hvd', {
                url: '/hvd',
                templateUrl: 'app/hvd/hvd.html',
                controller: 'HvdCtrl',
                redirectTo: 'hvd.overview',
                authenticate: true
            })
                .state('hvd.overview', {
                    url: '/overview',
                    templateUrl: 'app/hvd/overview/overview.html',
                    controller: 'OverviewCtrl',
                    authenticate: true
                })
                .state('hvd.import', {
                    url: '/import',
                    templateUrl: 'app/hvd/import/import.html',
                    controller: 'HvdImportCtrl',
                    authenticate: true
                });
    }]);