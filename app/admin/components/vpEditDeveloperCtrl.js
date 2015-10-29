;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditDeveloperController', ['$modalInstance', 'activeVendor', 'commonService', function ($modalInstance, activeVendor, commonService) {
            var vm = this;
            vm.developer = angular.copy(activeVendor);
            vm.updateDeveloper = {vendorIds: [vm.developer.vendorId]};

            vm.addressRequired = addressRequired;
            vm.save = save;
            vm.cancel = cancel;

            ////////////////////////////////////////////////////////////////////

            function addressRequired () {
                return commonService.addressRequired(vm.developer.address);
            }

            function save () {
                vm.updateDeveloper.vendor = vm.developer;
                commonService.updateVendor(vm.updateDeveloper)
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
