;(function () {
    'use strict';

    angular.module('app.product')
        .controller('ProductController', ['$scope', '$log', '$routeParams', 'productService', function($scope, $log, $routeParams, productService) {
            var self = this;
            this.productId = $routeParams.id;
        }]);
})();
