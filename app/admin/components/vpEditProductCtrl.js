;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditProductController', ['$modalInstance', 'activeProduct', 'vendors', 'commonService', function ($modalInstance, activeProduct, vendors, commonService) {
            var vm = this;
            vm.product = angular.copy(activeProduct);
            vm.vendors = vendors;
            vm.updateProduct = {productIds: [vm.product.productId]};

            vm.save = save;
            vm.cancel = cancel;

            ////////////////////////////////////////////////////////////////////

            function save () {
                vm.updateProduct.product = vm.product;
                vm.updateProduct.newVendorId = vm.product.vendorId;
                commonService.updateProduct(vm.updateProduct)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            response.vendorId = vm.product.vendorId;
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
