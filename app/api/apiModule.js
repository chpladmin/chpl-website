;(function () {
    'use strict';

    angular.module('app.api', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/api', {
                templateUrl: 'api/api.html'
            });
        }]);
})();
