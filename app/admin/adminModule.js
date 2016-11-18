;(function () {
    'use strict';

    angular.module('app.admin', ['ngRoute', 'smart-table', 'app.common', 'app.loginServices', 'ngIdle', 'ngSanitize', 'ui.bootstrap'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/admin/:section?/:subSection?/:productId?', {
                templateUrl: 'admin/admin.html',
                title: 'CHPL Administration'
            });
        }])
        .config(function(IdleProvider, KeepaliveProvider) {
            // configure Idle settings
            IdleProvider.idle(60 * 20); // in seconds
            IdleProvider.timeout(false); // in seconds
            KeepaliveProvider.interval(60 * 5); // in seconds
        });

})();
