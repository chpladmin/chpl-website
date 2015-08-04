;(function () {
    'use strict';

    angular.module('app.product', ['ngRoute', 'app.common', 'ui.bootstrap'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/product/:id', {
                templateUrl: 'product/product.html'
            });
        }]);
})();
