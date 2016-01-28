;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('MergeProductController', ['$modalInstance', 'products', 'developerId', 'commonService', function ($modalInstance, products, developerId, commonService) {
            var vm = this;

            vm.activate = activate;
            vm.save = save;
            vm.cancel = cancel;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.products = angular.copy(products);
                vm.product = angular.copy(vm.products[0]);
                delete vm.product.lastModifiedDate;
                delete vm.product.productId;
                vm.updateProduct = {productIds: [],
                                    newDeveloperId: developerId};
                for (var i = 0; i < vm.products.length; i++) {
                    vm.updateProduct.productIds.push(vm.products[i].productId);
                }
            }

            function save () {
                vm.updateProduct.product = vm.product;
                commonService.updateProduct(vm.updateProduct)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $modalInstance.close(response);
                        } else {
                            $modalInstance.dismiss('An error occurred');
                        }
                    },function (error) {
                        $modalInstance.dismiss(error.data.error);
                    });
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }
        }]);
})();
