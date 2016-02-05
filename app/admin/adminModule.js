;(function () {
    'use strict';

    angular.module('app.admin', ['ngRoute', 'smart-table', 'app.common', 'app.loginServices', 'ngIdle', 'ngSanitize', 'ui.bootstrap'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/admin/:section?/:productId?', {
                templateUrl: 'admin/admin.html'
            });
        }])
        .config(function(IdleProvider, KeepaliveProvider) {
            // configure Idle settings
            IdleProvider.idle(60 * 20); // in seconds
            IdleProvider.timeout(false); // in seconds
            KeepaliveProvider.interval(60 * 5); // in seconds
        });

})();
