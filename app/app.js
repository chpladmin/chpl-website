;(function () {
    'use strict';

    angular.module('app', ['ngRoute', 'angular-loading-bar', 'ngAnimate', 'angulartics', 'angulartics.google.analytics', 'googlechart', 'angularFileUpload',
                           'app.api', 'app.nav', 'app.compare', 'app.product', 'app.search', 'app.admin', 'app.userRegistration'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .otherwise({redirectTo: '/search'});
        }]);
})();
