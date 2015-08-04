;(function () {
    'use strict';

    angular.module('app.admin', ['ngRoute', 'app.common', 'app.loginServices'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/admin', {
                templateUrl: 'admin/admin.html'
            });
        }]);
})();
