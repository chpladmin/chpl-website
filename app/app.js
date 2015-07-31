;(function () {
    'use strict';

    // Declare app level module which depends on views, and components
    angular.module('app', ['ngRoute', 'angular-loading-bar', 'ngAnimate',
                           'app.nav', 'app.compare', 'app.product', 'app.search', 'app.admin'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .otherwise({redirectTo: '/search'});
        }]);
})();
