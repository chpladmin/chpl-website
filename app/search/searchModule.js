;(function () {
    'use strict';

    angular.module('app.search', ['ngRoute', 'ngStorage', 'smart-table', 'app.common'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/search', {
                templateUrl: 'search/search.html',
                title: 'Search'
            });
        }]);
})();
