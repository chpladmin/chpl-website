;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditProductController', ['$modalInstance', 'activeProduct', 'developers', 'commonService', function ($modalInstance, activeProduct, developers, commonService) {
            var vm = this;
            vm.product = angular.copy(activeProduct);
            vm.developers = developers;
            vm.updateProduct = {productIds: [vm.product.productId]};

            vm.addPreviousOwner = addPreviousOwner;
            vm.removePreviousOwner = removePreviousOwner;
            vm.required = required;
            vm.save = save;
            vm.cancel = cancel;

            ////////////////////////////////////////////////////////////////////

            function addPreviousOwner () {
                vm.product.ownerHistory.push({});
            }

            function removePreviousOwner (idx) {
                vm.product.ownerHistory.splice(idx, 1);
            }

            function required (name, idx) {
                if (idx) {
                    name = name + idx;
                }
                console.log(name, idx, name + idx);
                return vm.editForm[name][$error][required];// &&
//                    vm.editForm[name].$touched;
            }

            function save () {
                vm.updateProduct.product = vm.product;
                vm.updateProduct.newDeveloperId = vm.product.developerId;
                commonService.updateProduct(vm.updateProduct)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            response.developerId = vm.product.developerId;
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
