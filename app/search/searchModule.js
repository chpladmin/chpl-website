;(function () {
    'use strict';

    angular.module('app.search', ['ngRoute', 'smart-table'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/search', {
                templateUrl: 'search/search.html'
            });
        }]);
})();
