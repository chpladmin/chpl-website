;(function () {
    'use strict';

    angular.module('app.overview', [])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/overview', {
                templateUrl: 'overview/overview.html'
            });
        }]);
})();
