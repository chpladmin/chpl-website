(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditProductController', EditProductController);

    /** @ngInject */
    function EditProductController ($uibModalInstance, activeProduct, networkService) {
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
            if (!vm.product.contact) {
                vm.product.contact = {};
            }
            vm.updateProduct = {productIds: [vm.product.productId]};
            networkService.getDevelopers(true).then(function (developers) {
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
                    developerId: prevId,
                },
                transferDate: new Date(),
            });
        }

        function isContactRequired () {
            if (vm.product.contact) {
                if (vm.product.contact.fullName ||
                    vm.product.contact.friendlyName ||
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
            networkService.updateProduct(vm.updateProduct)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        response.developerId = vm.product.developerId;
                        $uibModalInstance.close(response);
                    } else {
                        $uibModalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    var errorMessage = [];
                    if (error.data.error) {
                        errorMessage.push(error.data.error);
                    } else if (error.data.errorMessages) {
                        errorMessage = error.data.errorMessages
                    } else {
                        errorMessage.push('An error occurred');
                    }
                    $uibModalInstance.dismiss(errorMessage);
                });
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }
    }
})();
