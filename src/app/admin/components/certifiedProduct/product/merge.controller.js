(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('MergeProductController', MergeProductController);

    /** @ngInject */
    function MergeProductController ($uibModalInstance, developerId, networkService, products) {
        var vm = this;

        vm.addPreviousOwner = addPreviousOwner;
        vm.isContactRequired = isContactRequired;
        vm.removePreviousOwner = removePreviousOwner;
        vm.save = save;
        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            networkService.getDevelopers(true).then(function (developers) {
                vm.developers = developers.developers;
            });
            vm.products = angular.copy(products);
            vm.product = angular.copy(vm.products[0]);
            delete vm.product.lastModifiedDate;
            delete vm.product.productId;
            vm.product.ownerHistory = [];
            vm.updateProduct = {
                productIds: [],
                newDeveloperId: developerId,
            };
            for (var i = 0; i < vm.products.length; i++) {
                vm.updateProduct.productIds.push(vm.products[i].productId);
            }
        }

        function addPreviousOwner () {
            vm.product.ownerHistory.push({});
        }

        function isContactRequired () {
            if (vm.product.contact) {
                if (vm.product.contact.firstName ||
                    vm.product.contact.lastName ||
                    vm.product.contact.title ||
                    vm.product.contact.email ||
                    vm.product.contact.phoneNumber) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        function removePreviousOwner (idx) {
            vm.product.ownerHistory.splice(idx, 1);
        }

        function save () {
            vm.updateProduct.product = vm.product;
            for (var i = 0; i < vm.product.ownerHistory.length; i++) {
                vm.product.ownerHistory[i].transferDate = vm.product.ownerHistory[i].transferDate.getTime();
            }
            networkService.updateProduct(vm.updateProduct)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close(response);
                    } else {
                        $uibModalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $uibModalInstance.dismiss(error.data.error);
                });
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }
    }
})();
