(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('MergeVersionController', MergeVersionController);

    /** @ngInject */
    function MergeVersionController ($uibModalInstance, commonService, productId, versions) {
        var vm = this;

        vm.save = save;
        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.versions = angular.copy(versions);
            vm.version = angular.copy(vm.versions[0]);
            delete vm.version.lastModifiedDate;
            delete vm.version.versionId;
            vm.updateVersion = {
                versionIds: [],
                newProductId: productId
            };
            for (var i = 0; i < vm.versions.length; i++) {
                vm.updateVersion.versionIds.push(vm.versions[i].versionId);
            }
        }

        function save () {
            vm.updateVersion.version = vm.version;
            commonService.updateVersion(vm.updateVersion)
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
