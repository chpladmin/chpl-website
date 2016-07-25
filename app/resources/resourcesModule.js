;(function () {
    'use strict';

    angular.module('app.resources', ['ngRoute', 'ngStorage', 'app.common'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/resources', {
                templateUrl: 'resources/resources.html',
                title: 'CHPL Resources'
            });
        }]);
})();
