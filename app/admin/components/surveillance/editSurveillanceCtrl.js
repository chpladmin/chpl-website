;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditSurveillanceController', ['$modal', '$modalInstance', '$log', 'surveillance', 'surveillanceTypes', 'workType', 'commonService', 'utilService', function ($modal, $modalInstance, $log, surveillance, surveillanceTypes, workType, commonService, utilService) {
            var vm = this;

            vm.addRequirement = addRequirement;
            vm.cancel = cancel;
            vm.editRequirement = editRequirement;
            vm.inspectNonconformities = inspectNonconformities;
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

            function addRequirement () {
                vm.surveillance.requirements.push({});
                vm.editRequirement(vm.surveillance.requirements[vm.surveillance.requirements.length - 1]);
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function editRequirement (req) {
                vm.modalInstance = $modal.open({
                    templateUrl: 'admin/components/surveillance/editRequirement.html',
                    controller: 'EditRequirementController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        requirement: function () { return req; },
                        surveillanceTypes: function () { return vm.data; }
                    },
                    size: 'lg'
                });
                vm.modalInstance.result.then(function (response) {
                    req = response;
                }, function (result) {
                    $log.info(result);
                });
            }

            function inspectNonconformities (noncons) {
                vm.modalInstance = $modal.open({
                    templateUrl: 'admin/components/surveillance/nonconformityInspect.html',
                    controller: 'NonconformityInspectController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        nonconformities: function () { return noncons; }
                    },
                    size: 'lg'
                });
                vm.modalInstance.result.then(function (response) {
                    noncons = response;
                }, function (result) {
                    $log.info(result);
                });
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
