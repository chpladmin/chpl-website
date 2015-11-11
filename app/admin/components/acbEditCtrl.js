;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditAcbController', ['$modalInstance', 'acb', 'commonService', function ($modalInstance, acb, commonService) {
            var vm = this;
            vm.acb = angular.copy(acb);

            vm.addressRequired = addressRequired;
            vm.save = save;
            vm.cancel = cancel;
            vm.deleteAcb = deleteAcb;

            ////////////////////////////////////////////////////////////////////

            function addressRequired () {
                return commonService.addressRequired(vm.acb.address);
            }

            function save () {
                commonService.modifyACB(vm.acb)
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

            function deleteAcb () {
                commonService.deleteACB(acb.id)
                    .then(function (response) {
                        $modalInstance.close('deleted');
                    });
            }
        }]);
})();
