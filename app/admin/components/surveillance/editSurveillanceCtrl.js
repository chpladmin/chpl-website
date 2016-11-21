;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditSurveillanceController', ['$modal', '$modalInstance', '$log', 'surveillance', 'surveillanceTypes', 'workType', 'commonService', 'utilService', function ($modal, $modalInstance, $log, surveillance, surveillanceTypes, workType, commonService, utilService) {
            var vm = this;

            vm.addRequirement = addRequirement;
            vm.cancel = cancel;
            vm.deleteSurveillance = deleteSurveillance;
            vm.deleteRequirement = deleteRequirement;
            vm.editRequirement = editRequirement;
            vm.inspectNonconformities = inspectNonconformities;
            vm.save = save;
            vm.sortRequirements = utilService.sortRequirements;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.surveillance = angular.copy(surveillance);
                vm.surveillance.startDateObject = new Date(vm.surveillance.startDate);
                if (vm.surveillance.endDate) {
                    vm.surveillance.endDateObject = new Date(vm.surveillance.endDate);
                }
                vm.disableValidation = vm.surveillance.errorMessages && vm.surveillance.errorMessages.length > 0;
                vm.workType = workType;
                vm.showFormErrors = false;
                vm.data = surveillanceTypes;
                if (vm.surveillance.type) {
                    vm.surveillance.type = findModel(vm.surveillance.type, vm.data.surveillanceTypes.data);
                }
            }

            function addRequirement () {
                vm.modalInstance = $modal.open({
                    templateUrl: 'admin/components/surveillance/editRequirement.html',
                    controller: 'EditRequirementController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        disableValidation: function () { return false; },
                        randomized: function () { return vm.surveillance.type.name === 'Randomized'; },
                        requirement: function () { return { nonconformities: [] }; },
                        surveillanceTypes: function () { return vm.data; }
                    },
                    size: 'lg'
                });
                vm.modalInstance.result.then(function (response) {
                    if (!vm.surveillance.requirements) {
                        vm.surveillance.requirements = [];
                    }
                    vm.surveillance.requirements.push(response);
                }, function (result) {
                    $log.info(result);
                });
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function deleteSurveillance () {
                commonService.deleteSurveillance(vm.surveillance.id)
                    .then(function (response) {
                        if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                            $modalInstance.close(response);
                        } else {
                            vm.errorMessages = [response];
                        }
                    },function (error) {
                        vm.errorMessages = [error.statusText];
                    });
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
                        disableValidation: function () { return vm.disableValidation; },
                        randomized: function () { return vm.surveillance.type.name === 'Randomized'; },
                        requirement: function () { return req; },
                        surveillanceTypes: function () { return vm.data; }
                    },
                    size: 'lg'
                });
                vm.modalInstance.result.then(function (response) {
                    var found = false;
                    if (response.id) {
                        for (var i = 0; i < vm.surveillance.requirements.length; i++) {
                            if (vm.surveillance.requirements[i].id === response.id) {
                                vm.surveillance.requirements[i] = response;
                                found = true;
                            }
                        }
                    }
                    if (!found) {
                        vm.surveillance.requirements.push(response);
                    }
                }, function (result) {
                    $log.info(result);
                });
            }

            function deleteRequirement (req) {
                for (var i = 0; i < vm.surveillance.requirements.length; i++) {
                    if (angular.equals(vm.surveillance.requirements[i],req)) {
                        vm.surveillance.requirements.splice(i,1);
                    }
                }
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
                } else {
                    vm.surveillance.endDate = null;
                }
                if (vm.workType === 'confirm') {
                    $modalInstance.close(vm.surveillance);
                } else if (vm.workType === 'initiate') {
                    commonService.initiateSurveillance(vm.surveillance)
                        .then(function (response) {
                            if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                                $modalInstance.close(response);
                            } else {
                                vm.errorMessages = [response];
                            }
                        },function (error) {
                            vm.errorMessages = [error.statusText];
                        });
                } else if (vm.workType === 'edit') {
                    commonService.updateSurveillance(vm.surveillance)
                        .then(function (response) {
                            if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                                $modalInstance.close(response);
                            } else {
                                vm.errorMessages = [response];
                            }
                        },function (error) {
                            vm.errorMessages = [error.statusText];
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
