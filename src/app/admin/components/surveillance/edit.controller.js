(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditSurveillanceController', EditSurveillanceController);

    /** @ngInject */
    function EditSurveillanceController ($log, $uibModal, $uibModalInstance, authService, commonService, surveillance, surveillanceTypes, utilService, workType) {
        var vm = this;

        vm.addRequirement = addRequirement;
        vm.cancel = cancel;
        vm.deleteRequirement = deleteRequirement;
        vm.deleteSurveillance = deleteSurveillance;
        vm.editRequirement = editRequirement;
        vm.inspectNonconformities = inspectNonconformities;
        vm.isAcbAdmin = authService.isAcbAdmin;
        vm.isAcbStaff = authService.isAcbStaff;
        vm.isChplAdmin = authService.isChplAdmin;
        vm.missingEndDate = missingEndDate;
        vm.save = save;
        vm.sortRequirements = utilService.sortRequirements;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.authorities = [];
            if (vm.isAcbAdmin()){
                vm.authorities.push('ROLE_ACB_ADMIN');
            }
            if (vm.isAcbStaff()){
                vm.authorities.push('ROLE_ACB_STAFF');
            }
            if (vm.isChplAdmin()){
                vm.authorities.push('ROLE_ADMIN');
            }
            vm.surveillance = angular.copy(surveillance);
            if (vm.surveillance.startDate) {
                vm.surveillance.startDateObject = new Date(vm.surveillance.startDate);
            }
            if (vm.surveillance.endDate) {
                vm.surveillance.endDateObject = new Date(vm.surveillance.endDate);
            }
            vm.disableValidation = vm.surveillance.errorMessages && vm.surveillance.errorMessages.length > 0;
            vm.workType = workType;
            vm.showFormErrors = false;
            vm.data = surveillanceTypes;
            if (vm.surveillance.type) {
                vm.surveillance.type = utilService.findModel(vm.surveillance.type, vm.data.surveillanceTypes.data);
            }
        }

        function addRequirement () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/surveillance/requirement/edit.html',
                controller: 'EditRequirementController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    disableValidation: function () { return false; },
                    randomized: function () { return vm.surveillance.type.name === 'Randomized'; },
                    requirement: function () { return { nonconformities: [] }; },
                    surveillanceId: function () { return vm.surveillance.id; },
                    surveillanceTypes: function () { return vm.data; },
                    workType: function () { return 'add'; },
                },
                size: 'lg',
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
            $uibModalInstance.dismiss('cancelled');
        }

        function deleteRequirement (req) {
            for (var i = 0; i < vm.surveillance.requirements.length; i++) {
                if (angular.equals(vm.surveillance.requirements[i],req)) {
                    vm.surveillance.requirements.splice(i,1);
                }
            }
        }

        function deleteSurveillance () {
            commonService.deleteSurveillance(vm.surveillance.id)
                .then(function (response) {
                    if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                        $uibModalInstance.close(response);
                    } else {
                        vm.errorMessages = [response];
                    }
                },function (error) {
                    vm.errorMessages = [error.statusText];
                });
        }

        function editRequirement (req) {
            req.guiId = req.id ? req.id : (new Date()).getTime();
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/surveillance/requirement/edit.html',
                controller: 'EditRequirementController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    disableValidation: function () { return vm.disableValidation; },
                    randomized: function () { return vm.surveillance.type.name === 'Randomized'; },
                    requirement: function () { return req; },
                    surveillanceId: function () { return vm.surveillance.id; },
                    surveillanceTypes: function () { return vm.data; },
                    workType: function () { return 'edit'; },
                },
                size: 'lg',
            });
            vm.modalInstance.result.then(function (response) {
                var found = false;
                for (var i = 0; i < vm.surveillance.requirements.length; i++) {
                    if (vm.surveillance.requirements[i].guiId === response.guiId) {
                        vm.surveillance.requirements[i] = response;
                        found = true;
                    }
                }
                if (!found) {
                    vm.surveillance.requirements.push(response);
                }
            }, function (result) {
                $log.info(result);
            });
        }

        function inspectNonconformities (noncons) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/surveillance/nonconformity/inspect.html',
                controller: 'NonconformityInspectController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    nonconformities: function () { return noncons; },
                },
                size: 'lg',
            });
            vm.modalInstance.result.then(function (response) {
                noncons = response;
            }, function (result) {
                $log.info(result);
            });
        }

        function missingEndDate () {
            var noNcs = true;
            var allClosed = true;
            if (vm.surveillance.requirements) {
                for (var i = 0; i < vm.surveillance.requirements.length; i++) {
                    noNcs = noNcs && (!vm.surveillance.requirements[i].nonconformities || vm.surveillance.requirements[i].nonconformities.length === 0);
                    for (var j = 0; j < vm.surveillance.requirements[i].nonconformities.length; j++) {
                        allClosed = allClosed && (vm.surveillance.requirements[i].nonconformities[j].status.name === 'Closed');
                    }
                }
            }
            return vm.surveillance.requirements && (noNcs || allClosed) && !vm.surveillance.endDateObject;
        }

        function save () {
            vm.surveillance.startDate = vm.surveillance.startDateObject.getTime();
            if (vm.surveillance.endDateObject) {
                vm.surveillance.endDate = vm.surveillance.endDateObject.getTime();
            } else {
                vm.surveillance.endDate = null;
            }
            if (vm.workType === 'confirm') {
                $uibModalInstance.close(vm.surveillance);
            } else if (vm.workType === 'initiate') {
                if (!vm.surveillance.authority){
                    if (vm.isChplAdmin()){
                        vm.surveillance.authority = 'ROLE_ADMIN';
                    }
                    else if (vm.isAcbAdmin()){
                        vm.surveillance.authority = 'ROLE_ACB_ADMIN';
                    }
                    else if (vm.isAcbStaff()){
                        vm.surveillance.authority = 'ROLE_ACB_STAFF';
                    }
                }
                vm.surveillance.certifiedProduct.edition = vm.surveillance.certifiedProduct.certificationEdition.name;
                commonService.initiateSurveillance(vm.surveillance)
                    .then(function (response) {
                        if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                            $uibModalInstance.close(response);
                        } else {
                            vm.errorMessages = [response];
                        }
                    },function (error) {
                        if (error.data.errorMessages && error.data.errorMessages.length > 0) {
                            vm.errorMessages = error.data.errorMessages;
                        } else if (error.data.error) {
                            vm.errorMessages = [error.data.error];
                        } else {
                            vm.errorMessages = [error.statusText];
                        }
                    });
            } else if (vm.workType === 'edit') {
                commonService.updateSurveillance(vm.surveillance)
                    .then(function (response) {
                        if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                            $uibModalInstance.close(response);
                        } else {
                            vm.errorMessages = [response];
                        }
                    },function (error) {
                        if (error.data.errorMessages && error.data.errorMessages.length > 0) {
                            vm.errorMessages = error.data.errorMessages;
                        } else {
                            vm.errorMessages = [error.statusText];
                        }
                    });
            }
        }
    }
})();
