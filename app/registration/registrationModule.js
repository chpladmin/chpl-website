;(function () {
    'use strict';

    angular.module('app.registration', ['ngRoute', 'app.admin'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .when('/registration/create-user/:hash', {
                    templateUrl: 'registration/create-user.html',
                    controller: 'CreateController',
                    controllerAs: 'vm',
                    title: 'CHPL Registration'
                })
                .when('/registration/confirm-user/:hash', {
                    templateUrl: 'registration/confirm-user.html',
                    controller: 'ConfirmController',
                    controllerAs: 'vm',
                    title: 'CHPL Registration'
                });
        }]);
})();
