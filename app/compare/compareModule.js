;(function () {
    'use strict';

    angular.module('app.compare', ['ngRoute', 'app.common'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/compare/:compareIds', {
                templateUrl: 'compare/compare.html',
                title: 'CHPL Product Comparison'
            });
        }]);
})();
