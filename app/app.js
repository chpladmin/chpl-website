;(function () {
    'use strict';

    angular.module('app', ['ngRoute', 'angular-loading-bar', 'ngAnimate', 'angulartics', 'angulartics.google.analytics', 'angulartics.google.tagmanager',// 'angulartics.debug',
                           'googlechart', 'angularFileUpload', 'angular-confirm', 'ngSanitize', 'swaggerUi', 'ngCsv',
                           'app.resources', 'app.nav', 'app.compare', 'app.product', 'app.search', 'app.admin', 'app.overview', 'app.registration'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .otherwise({redirectTo: '/search'});
        }])
        .run(['$location', '$rootScope', '$anchorScroll', '$timeout', '$window', function($location, $rootScope, $anchorScroll, $timeout, $window) {
            $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
                if(current.$$route) {
                    $rootScope.title = current.$$route.title;
                    $rootScope.currentPage = $location.path();
                }
                if($location.hash()) {
                    $anchorScroll();
                    $timeout(function () {
                        var element = $window.document.getElementById('mainContent');
                        var elementAng = angular.element($window.document.getElementById('mainContent'));
                        if (element && elementAng) {
                            elementAng.attr('tabindex', '-1');
                            element.focus();
                        }
                    });
                }
            });
        }]);
})();
