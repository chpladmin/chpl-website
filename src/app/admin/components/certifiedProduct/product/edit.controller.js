(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditProductController', EditProductController);

    /** @ngInject */
    function EditProductController ($uibModalInstance, activeProduct, commonService) {
        var vm = this;

        vm.addPreviousOwner = addPreviousOwner;
        vm.changeCurrent = changeCurrent;
        vm.isContactRequired = isContactRequired;
        vm.removePreviousOwner = removePreviousOwner;
        vm.save = save;
        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.product = angular.copy(activeProduct);
            vm.updateProduct = {productIds: [vm.product.productId]};
            commonService.getDevelopers(true).then(function (developers) {
                vm.developers = developers.developers;
            });
            for (var i = 0; i < vm.product.ownerHistory.length; i++) {
                vm.product.ownerHistory[i].transferDate = new Date(vm.product.ownerHistory[i].transferDate);
            }
        }

        function addPreviousOwner () {
            vm.product.ownerHistory.push({});
        }

        function changeCurrent (prevId) {
            vm.product.ownerHistory.push({
                developer: {
                    developerId: prevId
                },
                transferDate: new Date()
            });
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
            for (var i = 0; i < vm.product.ownerHistory.length; i++) {
                vm.product.ownerHistory[i].transferDate = vm.product.ownerHistory[i].transferDate.getTime();
            }
            if (!vm.isContactRequired() && vm.product.contact) {
                delete vm.product.contact;
            }
            vm.updateProduct.product = vm.product;
            vm.updateProduct.newDeveloperId = vm.product.developerId;
            commonService.updateProduct(vm.updateProduct)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        response.developerId = vm.product.developerId;
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
