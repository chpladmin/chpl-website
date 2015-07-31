;(function () {
    'use strict';

    angular.module('app.admin', ['ngRoute', 'app.common', 'app.loginServices'])
        .constant('API', 'http://localhost:8080/chpl-service')
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/admin', {
                templateUrl: 'admin/admin.html'
            });
        }]);
})();
