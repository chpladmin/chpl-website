;(function () {
    'use strict';

    angular.module('app.product')
        .controller('ProductController', ['$scope', '$log', '$routeParams', '$modal', 'commonService', function($scope, $log, $routeParams, $modal, commonService) {
            var self = this;
            self.modalInstance;
            self.productId = $routeParams.id;
            commonService.getProduct(self.productId)
                .then(function (data) {
                    self.product = data;
                }, function (error) {
                    $log.error(error);
                });

            self.openLastModifiedDate = function (size) {
                self.modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceController',
                    controllerAs: 'modalVm',
                    animation: false,
                    resolve: {
                        items: function() {
                            return self.product.lastModifiedItems;
                        }
                    },
                    size: size
                });
            };
        }]);

    angular.module('app.product')
        .controller('ModalInstanceController', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
            var self = this;
            self.items = items;
            self.ok = function () {
                $modalInstance.close('ok');
            };
        }]);
})();
