;(function () {
    'use strict';

    angular.module('app.decertifications', ['ngRoute', 'app.common'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/decertifications/developers', {
                controller: 'DecertifiedDevelopersController',
                controllerAs: 'vm',
                templateUrl: 'decertifications/developers/developers.html',
                title: 'Decertified Developers'
            });
            $routeProvider.when('/decertifications/products', {
                controller: 'DecertifiedProductsController',
                controllerAs: 'vm',
                templateUrl: 'decertifications/products/products.html',
                title: 'Decertified Products'
            });
        }]);
})();
