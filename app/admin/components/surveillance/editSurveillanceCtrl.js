;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditSurveillanceController', ['$modalInstance', '$log', 'surveillance', 'surveillanceTypes', 'workType', 'commonService', 'utilService', function ($modalInstance, $log, surveillance, surveillanceTypes, workType, commonService, utilService) {
            var vm = this;

            vm.cancel = cancel;
            vm.save = save;
            vm.sortRequirement = utilService.sortRequirement;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.surveillance = angular.copy(surveillance);
                vm.surveillance.startDateObject = new Date(vm.surveillance.startDate);
                if (vm.surveillance.endDate) {
                    vm.surveillance.endDateObject = new Date(vm.surveillance.endDate);
                }
                vm.workType = workType;
                vm.showFormErrors = false;
                vm.data = surveillanceTypes;
                vm.surveillance.type = findModel(vm.surveillance.type, vm.data.surveillanceTypes.data);
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function save () {
                vm.surveillance.startDate = vm.surveillance.startDateObject.getTime();
                if (vm.surveillance.endDateObject) {
                    vm.surveillance.endDate = vm.surveillance.endDateObject.getTime();
                }
                if (vm.workType === 'confirm') {
                    $modalInstance.close(vm.surveillance);
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

            ////////////////////////////////////////////////////////////////////

            function findModel (id, array) {
                for (var i = 0; i < array.length; i++) {
                    if (id.id === array[i].id) {
                        id = array[i];
                    }
                };
                return id;
            }
        }]);
})();
