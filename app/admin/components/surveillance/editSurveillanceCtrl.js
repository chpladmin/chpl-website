;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditSurveillanceController', ['$modalInstance', 'surveillance', 'workType', 'commonService', 'authService', function ($modalInstance, surveillance, workType, commonService, authService) {
            var vm = this;

            vm.cancel = cancel;
            vm.save = save;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.surveillance = angular.copy(surveillance);
                vm.workType = workType;
                vm.showFormErrors = false;
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function save () {
                if (vm.workType === 'confirm') {
                    modalInstance.close(vm.surveillance);
                } else {
                    commonService.updateSurveillance(vm.surveillance)
                        .then(function (response) {
                            if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                                $modalInstance.close(response);
                            } else {
                                $modalInstance.dismiss('An error occurred');
                            }
                        },function (error) {
                            $modalInstance.dismiss(error.data.error);
                        });
                }
            }
        }]);
})();
