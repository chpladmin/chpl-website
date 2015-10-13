;(function () {
    'use strict';

    angular.module('app.userRegistration', ['ngRoute', 'app.admin'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/userRegistration/:hash', {
                templateUrl: 'userRegistration/userRegistration.html'
            });
        }]);
})();
