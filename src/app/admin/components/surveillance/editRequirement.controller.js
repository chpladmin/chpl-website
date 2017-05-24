(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditRequirementController', EditRequirementController);

    /** @ngInject */
    function EditRequirementController ($log, $uibModal, $uibModalInstance, disableValidation, randomized, requirement, surveillanceId, surveillanceTypes, utilService, workType) {
        var vm = this;

        vm.addNonconformity = addNonconformity;
        vm.cancel = cancel;
        vm.deleteNonconformity = deleteNonconformity;
        vm.editNonconformity = editNonconformity;
        vm.isNonconformityRequired = isNonconformityRequired;
        vm.save = save;
        vm.sortCriteria = utilService.sortCert;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.data = surveillanceTypes;
            vm.disableValidation = disableValidation;
            vm.randomized = randomized;
            vm.requirement = angular.copy(requirement);
            vm.showFormErrors = false;
            vm.surveillanceId = surveillanceId;
            vm.workType = workType;
            $log.debug(vm.workType);
            if (vm.requirement.type) {
                vm.requirement.type = findModel(vm.requirement.type, vm.data.surveillanceRequirementTypes.data);
            }
            if (vm.requirement.result) {
                vm.requirement.result = findModel(vm.requirement.result, vm.data.surveillanceResultTypes.data);
            }
        }

        function addNonconformity () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/surveillance/editNonconformity.html',
                controller: 'EditNonconformityController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    disableValidation: function () { return false; },
                    nonconformity: function () { return {}; },
                    randomized: function () { return vm.randomized; },
                    requirementId: function () { return vm.requirement.id; },
                    surveillanceId: function () { return vm.surveillanceId; },
                    surveillanceTypes: function () { return vm.data; },
                    workType: function () { return 'add'; }
                },
                size: 'lg'
            });
            vm.modalInstance.result.then(function (response) {
                if (!vm.requirement.nonconformities) {
                    vm.requirement.nonconformities = [];
                }
                vm.requirement.nonconformities.push(response);
            }, function (result) {
                $log.info(result);
            });
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function deleteNonconformity (noncon) {
            for (var i = 0; i < vm.requirement.nonconformities.length; i++) {
                if (angular.equals(vm.requirement.nonconformities[i], noncon)) {
                    vm.requirement.nonconformities.splice(i,1);
                }
            }
        }

        function editNonconformity (noncon) {
            noncon.guiId = noncon.id ? noncon.id : (new Date()).getTime();
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/surveillance/editNonconformity.html',
                controller: 'EditNonconformityController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    disableValidation: function () { return vm.disableValidation; },
                    nonconformity: function () { return noncon; },
                    randomized: function () { return vm.randomized; },
                    requirementId: function () { return vm.requirement.id; },
                    surveillanceId: function () { return vm.surveillanceId; },
                    surveillanceTypes: function () { return vm.data; },
                    workType: function () { return vm.workType; }
                },
                size: 'lg'
            });
            vm.modalInstance.result.then(function (response) {
                var found = false;
                for (var i = 0; i < vm.requirement.nonconformities.length; i++) {
                    if (vm.requirement.nonconformities[i].guiId === response.guiId) {
                        vm.requirement.nonconformities[i] = response;
                        found = true;
                    }
                }
                if (!found) {
                    vm.requirement.nonconformities.push(response);
                }
            }, function (result) {
                $log.info(result);
            });
        }

        function isNonconformityRequired () {
            return vm.requirement.result.name === 'Non-Conformity' &&
                (!vm.requirement.nonconformities || vm.requirement.nonconformities.length === 0);
        }

        function save () {
            if (vm.requirement.result.name === 'No Non-Conformity') {
                vm.requirement.nonconformities = [];
            }
            $uibModalInstance.close(vm.requirement);
        }

        ////////////////////////////////////////////////////////////////////

        function findModel (id, array) {
            for (var i = 0; i < array.length; i++) {
                if (id.id === array[i].id) {
                    id = array[i];
                }
            }
            return id;
        }
/*
        function findModelByValue (value, array) {
            for (var i = 0; i < array.length; i++) {
                if (value === array[i].name) {
                    value = array[i];
                }
            }
            return value;
        }
        */
    }
})();
