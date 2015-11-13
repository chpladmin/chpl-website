;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditVersionController', ['$modalInstance', 'activeVersion', 'commonService', function ($modalInstance, activeVersion, commonService) {
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
