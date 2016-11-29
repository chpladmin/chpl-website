;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('MergeVersionController', ['$modalInstance', 'versions', 'productId', 'commonService', function ($modalInstance, versions, productId, commonService) {
            var vm = this;

            vm.activate = activate;
            vm.save = save;
            vm.cancel = cancel;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.versions = angular.copy(versions);
                vm.version = angular.copy(vm.versions[0]);
                delete vm.version.lastModifiedDate;
                delete vm.version.versionId;
                vm.updateVersion = {versionIds: [],
                                    newProductId: productId};
                for (var i = 0; i < vm.versions.length; i++) {
                    vm.updateVersion.versionIds.push(vm.versions[i].versionId);
                }
            }

            function save () {
                vm.updateVersion.version = vm.version;
                commonService.updateVersion(vm.updateVersion)
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
