(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('MergeDeveloperController', MergeDeveloperController);

    /** @ngInject */
    function MergeDeveloperController ($uibModalInstance, developers, commonService) {
        var vm = this;

        vm.addPreviousStatus = addPreviousStatus;
        vm.addressRequired = addressRequired;
        vm.isBeingActivatedFromOncInactiveStatus = isBeingActivatedFromOncInactiveStatus;
        vm.removePreviousStatus = removePreviousStatus;
        vm.save = save;
        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.developers = angular.copy(developers);
            vm.developer = angular.copy(vm.developers[0]);
            delete vm.developer.lastModifiedDate;
            delete vm.developer.developerId;
            vm.developer.statusHistory = [];
            vm.updateDeveloper = {developerIds: []};
            vm.loadedAsInactiveByOnc = false;
            for (var i = 0; i < vm.developers.length; i++) {
                vm.updateDeveloper.developerIds.push(vm.developers[i].developerId);
                vm.loadedAsInactiveByOnc = vm.loadedAsInactiveByOnc || (vm.developers[i].status.status === 'Suspended by ONC' || vm.developers[i].status.status === 'Under certification ban by ONC');
            }
            vm.errorMessage = '';
        }

        function addPreviousStatus () {
            vm.developer.statusHistory.push({});
        }

        function addressRequired () {
            return commonService.addressRequired(vm.developer.address);
        }

        function isBeingActivatedFromOncInactiveStatus () {
            return vm.loadedAsInactiveByOnc && vm.developer.status.status !== 'Suspended by ONC' && vm.developer.status.status !== 'Under certification ban by ONC';
        }

        function removePreviousStatus (idx) {
            vm.developer.statusHistory.splice(idx, 1);
        }

        function save () {
            vm.updateDeveloper.developer = vm.developer;
            commonService.updateDeveloper(vm.updateDeveloper)
                .then(function (response) {
                    if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                        $uibModalInstance.close(response);
                    } else {
                        vm.errorMessage = response.error;
                    }
                },function (error) {
                    vm.errorMessage = error.data.error;
                });
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }
    }
})();
