;(function () {
    'use strict';

    angular.module('app.product')
        .controller('ProductController', ['$scope', '$log', '$routeParams', '$modal', 'commonService', function($scope, $log, $routeParams, $modal, commonService) {
            var vm = this;

            vm.activate = activate;
            vm.openLastModified = openLastModified;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                //vm.modalInstance;
                vm.productId = $routeParams.id;
                commonService.getProduct(vm.productId)
                    .then(function (data) {
                        vm.product = data;
                    }, function (error) {
                        $log.error(error);
                    });
            }

            function openLastModified () {
                vm.modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceController',
                    controllerAs: 'modalVm',
                    animation: false,
                    resolve: {
                        items: function() {
                            return vm.product.lastModifiedItems;
                        }
                    },
                    size: 'sm'
                });
            }
        }]);

    angular.module('app.product')
        .controller('ModalInstanceController', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
            var vm = this;
            vm.items = items;
            vm.ok = function () {
                $modalInstance.close('ok');
            };
        }]);
})();
