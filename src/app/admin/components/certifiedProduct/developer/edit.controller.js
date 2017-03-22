(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditDeveloperController', EditDeveloperController);

    /** @ngInject */
    function EditDeveloperController ($uibModalInstance, activeDeveloper, activeAcbs, commonService, authService) {
        var vm = this;

        vm.addPreviousStatus = addPreviousStatus;
        vm.addressRequired = addressRequired;
        vm.changeCurrentStatus = changeCurrentStatus;
        vm.isBeingActivatedFromOncInactiveStatus = isBeingActivatedFromOncInactiveStatus;
        vm.removePreviousStatus = removePreviousStatus;
        vm.save = save;
        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.developer = angular.copy(activeDeveloper);
            vm.updateDeveloper = {developerIds: [vm.developer.developerId]};
            vm.activeAcbs = angular.copy(activeAcbs);
            if (angular.isUndefined(vm.developer.statusHistory)) {
                vm.developer.statusHistory = [];
            }

            vm.isAcbAdmin = authService.isAcbAdmin();
            vm.isChplAdmin = authService.isChplAdmin();
            vm.showFormErrors = false;
            vm.loadedAsInactiveByOnc = (vm.developer.status.status === 'Suspended by ONC' || vm.developer.status.status === 'Under certification ban by ONC');
        }

        function addPreviousStatus () {
            vm.developer.statusHistory.push({});
        }

        function addressRequired () {
            return commonService.addressRequired(vm.developer.address);
        }

        function changeCurrentStatus (previousStatus) {
            vm.developer.statusHistory.push({
                status: {status: previousStatus},
                changeDate: new Date()
            });
        }

        function isBeingActivatedFromOncInactiveStatus () {
            return vm.loadedAsInactiveByOnc && vm.developer.status.status !== 'Suspended by ONC' && vm.developer.status.status !== 'Under certification ban by ONC';
        }

        function removePreviousStatus (idx) {
            vm.developer.statusHistory.splice(idx, 1);
        }

        function save () {
            vm.updateDeveloper.developer = vm.developer;
            angular.forEach(vm.developer.transMap, function (value, key) {
                var found = false;
                for (var i = 0; i < vm.developer.transparencyAttestations.length; i++) {
                    if (vm.developer.transparencyAttestations[i].acbName === key) {
                        vm.developer.transparencyAttestations[i].attestation = value;
                        found = true;
                    }
                }
                if (!found) {
                    vm.developer.transparencyAttestations.push({acbName: key, attestation: value});
                }
            });
            commonService.updateDeveloper(vm.updateDeveloper)
                .then(function (response) {
                    if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                        $uibModalInstance.close(response);
                    } else {
                        $uibModalInstance.dismiss('An error occurred');
                    }
                },function (error) {
                    $uibModalInstance.dismiss(error.data.error);
                });
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }
    }
})();
