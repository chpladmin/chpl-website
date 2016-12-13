(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditProductController', EditProductController);

    /** @ngInject */
    function EditProductController ($modalInstance, activeProduct, commonService) {
        var vm = this;
        vm.product = angular.copy(activeProduct);
        vm.updateProduct = {productIds: [vm.product.productId]};

        vm.addPreviousOwner = addPreviousOwner;
        vm.changeCurrent = changeCurrent;
        vm.removePreviousOwner = removePreviousOwner;
        vm.save = save;
        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
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

        function removePreviousOwner (idx) {
            vm.product.ownerHistory.splice(idx, 1);
        }

        function save () {
            for (var i = 0; i < vm.product.ownerHistory.length; i++) {
                vm.product.ownerHistory[i].transferDate = vm.product.ownerHistory[i].transferDate.getTime();
            }
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
    }
})();
