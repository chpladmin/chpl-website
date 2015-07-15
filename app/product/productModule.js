;(function () {
    'use strict';

    angular.module('app.product', ['ngRoute'])
        .constant('searchAPI', 'http://ainq.com')
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/product/:id', {
                templateUrl: 'product/product.html'
            });
        }]);
})();
