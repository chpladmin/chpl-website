(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditSedDetailsController', EditSedDetailsController);

    /** @ngInject */
    function EditSedDetailsController ($log, $uibModalInstance, criteria, listing, resources, ucdProcesses, utilService) {
        var vm = this;

        vm.cancel = cancel;
        vm.extendSelect = utilService.extendSelect;
        vm.save = save;
        vm.sortCert = utilService.sortCert;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.criteria = criteria;
            vm.listing = angular.copy(listing);
            vm.resources = resources;
            vm.ucdProcesses = angular.copy(ucdProcesses);
            if (vm.listing.sedTestingEnd) {
                vm.listing.sedTestingEndDate = new Date(vm.listing.sedTestingEnd);
            }
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function save () {
            if (vm.listing.sedTestingEndDate) {
                switch (typeof(vm.listing.sedTestingEndDate)) {
                case 'string':
                    vm.listing.sedTestingEnd = vm.listing.sedTestingEndDate;
                    break;
                case 'object':
                    vm.listing.sedTestingEnd = vm.listing.sedTestingEndDate.getTime();
                    break;
                    //no default
                }
            } else {
                vm.listing.sedTestingEnd = undefined;
            }
            $uibModalInstance.close({
                listing: vm.listing,
                ucdProcesses: vm.ucdProcesses,
            });
        }
    }
})();
