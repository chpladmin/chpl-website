(function () {
  'use strict';

  angular.module('chpl.components')
    .controller('EditSedDetailsController', EditSedDetailsController);

  /** @ngInject */
  function EditSedDetailsController ($log, $uibModalInstance, criteria, listing, ucdProcesses, utilService) {
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
      vm.ucdProcesses = angular.copy(ucdProcesses);
      if (vm.listing.sedTestingEndDate) {
        vm.sedDate = new Date(vm.listing.sedTestingEndDate);
      }
    }

    function cancel () {
      $uibModalInstance.dismiss('cancelled');
    }

    function save () {
      if (vm.sedDate) {
        switch (typeof(vm.sedDate)) {
        case 'string':
          vm.listing.sedTestingEndDate = new Date(vm.sedDate).getTime();
          break;
        case 'object':
          vm.listing.sedTestingEndDate = vm.sedDate.getTime();
          break;
                    //no default
        }
      } else {
        vm.listing.sedTestingEndDate = undefined;
      }
      $uibModalInstance.close({
        listing: vm.listing,
        ucdProcesses: vm.ucdProcesses,
      });
    }
  }
})();
