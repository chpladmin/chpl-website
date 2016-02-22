;(function () {
    'use strict';

    angular.module('app.overview', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/overview', {
                templateUrl: 'overview/overview.html',
                controller: 'OverviewController',
                controllerAs: 'vm',
                title: 'Overview'
            });
        }]);
})();
