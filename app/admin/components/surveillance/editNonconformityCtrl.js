;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditNonconformityController', ['$modalInstance', '$log', 'disableValidation', 'nonconformity', 'randomized', 'surveillanceTypes', function ($modalInstance, $log, disableValidation, nonconformity, randomized, surveillanceTypes) {
            var vm = this;

            vm.cancel = cancel;
            vm.save = save;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.nonconformity = angular.copy(nonconformity);
                vm.disableValidation = disableValidation;
                vm.randomized = randomized;
                vm.showFormErrors = false;
                vm.data = surveillanceTypes;
                if (vm.nonconformity.status) {
                    vm.nonconformity.status = findModel(vm.nonconformity.status, vm.data.nonconformityStatusTypes.data);
                }
                if (vm.nonconformity.nonconformityType) {
                    vm.nonconformity.nonconformityType = findModel(vm.nonconformity.nonconformityType, vm.data.nonconformityTypes.data);
                }
                if (vm.nonconformity.dateOfDetermination) {
                    vm.nonconformity.dateOfDeterminationObject = new Date(vm.nonconformity.dateOfDetermination);
                }
                if (vm.nonconformity.capApprovalDate) {
                    vm.nonconformity.capApprovalDateObject = new Date(vm.nonconformity.capApprovalDate);
                }
                if (vm.nonconformity.capStartDate) {
                    vm.nonconformity.capStartDateObject = new Date(vm.nonconformity.capStartDate);
                }
                if (vm.nonconformity.capEndDate) {
                    vm.nonconformity.capEndDateObject = new Date(vm.nonconformity.capEndDate);
                }
                if (vm.nonconformity.capMustCompleteDate) {
                    vm.nonconformity.capMustCompleteDateObject = new Date(vm.nonconformity.capMustCompleteDate);
                }
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function save () {
                if (vm.nonconformity.dateOfDeterminationObject) {
                    vm.nonconformity.dateOfDetermination = vm.nonconformity.dateOfDeterminationObject.getTime();
                } else {
                    vm.nonconformity.dateOfDetermination = null;
                }
                if (vm.nonconformity.capApprovalDateObject) {
                    vm.nonconformity.capApprovalDate = vm.nonconformity.capApprovalDateObject.getTime();
                } else {
                    vm.nonconformity.capApprovalDate = null;
                }
                if (vm.nonconformity.capStartDateObject) {
                    vm.nonconformity.capStartDate = vm.nonconformity.capStartDateObject.getTime();
                } else {
                    vm.nonconformity.capStartDate = null;
                }
                if (vm.nonconformity.capEndDateObject) {
                    vm.nonconformity.capEndDate = vm.nonconformity.capEndDateObject.getTime();
                } else {
                    vm.nonconformity.capEndDate = null;
                }
                if (vm.nonconformity.capMustCompleteDateObject) {
                    vm.nonconformity.capMustCompleteDate = vm.nonconformity.capMustCompleteDateObject.getTime();
                } else {
                    vm.nonconformity.capMustCompleteDate = null;
                }
                $modalInstance.close(vm.nonconformity);
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
