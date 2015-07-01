;(function () {
    'use strict';

    // Declare app level module which depends on views, and components
    angular.module('app', ['ngRoute', 'app.view1', 'app.view2', 'app.version', 'app.nav'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.otherwise({redirectTo: '/view1'});
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
