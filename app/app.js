;(function () {
    'use strict';

    // Declare app level module which depends on views, and components
    angular.module('app', ['ngRoute', 'angular-loading-bar', 'ngAnimate', 'app.nav', 'app.compare', 'app.product', 'app.search'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .when('', {redirectTo: '/'})
                .otherwise({redirectTo: '/search'});
        }])
        .config(function ($provide) {
            $provide.decorator('$exceptionHandler', ['$delegate', function($delegate) {
                return function (exception, cause) {
                    $delegate(exception, cause);
                    //alert(exception.message);
                };
            }])
        });
})();
