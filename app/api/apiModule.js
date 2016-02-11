;(function () {
    'use strict';

    angular.module('app.api', ['ngRoute', 'app.common'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/api', {
                templateUrl: 'api/api.html',
                title: 'API Reference'
            });
        }]);
})();
