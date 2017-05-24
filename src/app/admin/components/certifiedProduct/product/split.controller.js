(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('SplitProductController', SplitProductController);

    /** @ngInject */
    function SplitProductController ($log, $uibModalInstance, commonService, product, versions) {
        var vm = this;

        vm.moveToNew = moveToNew;
        vm.moveToOld = moveToOld;
        vm.save = save;
        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.product = angular.copy(product);
            vm.versions = angular.copy(versions);
            vm.splitProduct = {
                newVersions: [],
                oldProduct: product,
                oldVersions: versions
            };
        }

        function moveToNew () {
            for (var i = 0; i < vm.versionsToMoveToNew.length; i++) {
                vm.splitProduct.newVersions.push(angular.copy(vm.versionsToMoveToNew[i]));
                for (var j = 0; j < vm.splitProduct.oldVersions.length; j++) {
                    if (vm.versionsToMoveToNew[i] === vm.splitProduct.oldVersions[j]) {
                        vm.splitProduct.oldVersions.splice(j,1);
                    }
                }
            }
            vm.versionsToMoveToNew = [];
        }

        function moveToOld () {
            for (var i = 0; i < vm.versionsToMoveToOld.length; i++) {
                vm.splitProduct.oldVersions.push(angular.copy(vm.versionsToMoveToOld[i]));
                for (var j = 0; j < vm.splitProduct.newVersions.length; j++) {
                    if (vm.versionsToMoveToOld[i] === vm.splitProduct.newVersions[j]) {
                        vm.splitProduct.newVersions.splice(j,1);
                    }
                }
            }
            vm.versionsToMoveToOld = [];
        }

        function save () {
            commonService.splitProduct(vm.splitProduct)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close({
                            product: response.oldProduct,
                            versions: vm.splitProduct.oldVersions,
                            newProduct: response.newProduct
                        });
                    } else {
                        vm.errorMessage = response.data.error;
                    }
                },function (error) {
                    vm.errorMessage = error.data.error;
                });
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }
    }
})();
