;(function () {
    'use strict';

    angular.module('app', ['ngRoute', 'angular-loading-bar', 'ngAnimate', 'angulartics', 'angulartics.google.analytics', 'googlechart', 'angularFileUpload', 'angular-confirm',
                           'app.api', 'app.nav', 'app.compare', 'app.product', 'app.search', 'app.admin', 'app.overview', 'app.userRegistration'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .otherwise({redirectTo: '/search'});
        }]);
})();
