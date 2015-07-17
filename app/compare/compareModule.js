;(function () {
    'use strict';

    angular.module('app.compare', ['ngRoute', 'app.common'])
        .constant('searchAPI', 'http://ainq.com')
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/compare/:compareIds', {
                templateUrl: 'compare/compare.html'
            });
        }]);
})();
