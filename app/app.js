;(function () {
    'use strict';

    angular.module('app', ['ngRoute', 'angular-loading-bar', 'ngAnimate', 'angulartics', 'angulartics.google.analytics',
                           'googlechart', 'angularFileUpload', 'angular-confirm', 'ngSanitize', 'swaggerUi',
                           'app.api', 'app.nav', 'app.compare', 'app.product', 'app.search', 'app.admin', 'app.overview', 'app.registration'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .otherwise({redirectTo: '/search'});
        }])
        .run(['$location', '$rootScope', function($location, $rootScope) {
            $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
                if(current.$$route) {
                    $rootScope.title = current.$$route.title;
                }
            })
        }]);
})();
