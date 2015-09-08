;(function () {
    'use strict';

    angular.module('app', ['ngRoute', 'angular-loading-bar', 'ngAnimate',
                           'app.api', 'app.nav', 'app.compare', 'app.product', 'app.search', 'app.admin'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .otherwise({redirectTo: '/search'});
        }]);
})();
