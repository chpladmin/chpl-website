(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditVersionController', EditVersionController);

    /** @ngInject */
    function EditVersionController ($uibModalInstance, activeVersion, commonService) {
        var vm = this;
        vm.version = angular.copy(activeVersion);
        vm.updateVersion = {versionIds: [vm.version.versionId]};

        vm.save = save;
        vm.cancel = cancel;

        ////////////////////////////////////////////////////////////////////

        function save () {
            vm.updateVersion.version = vm.version;
            commonService.updateVersion(vm.updateVersion)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        response.Id = vm.version.productId;
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
