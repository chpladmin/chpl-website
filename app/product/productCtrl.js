;(function () {
    'use strict';

    angular.module('app.product')
        .controller('ProductController', ['$scope', '$log', '$routeParams', 'commonService', function($scope, $log, $routeParams, commonService) {
            var self = this;
            self.productId = $routeParams.id;
            commonService.getProduct(this.productId)
                .then(function (data) {
                    self.product = data;
                }, function (error) {
                    $log.error(error);
                });
        }]);
})();
