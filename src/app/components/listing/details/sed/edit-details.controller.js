(function () {
  'use strict';

  angular.module('chpl.components')
    .controller('EditSedDetailsController', EditSedDetailsController);

  /** @ngInject */
  function EditSedDetailsController ($uibModalInstance, criteria, listing, ucdProcesses) {
    var vm = this;

    vm.cancel = cancel;
    vm.handleDispatch = handleDispatch.bind(this);

    activate();

    ////////////////////////////////////////////////////////////////////

    function activate () {
      vm.criteria = criteria;
      vm.listing = angular.copy(listing);
      vm.ucdProcesses = angular.copy(ucdProcesses);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancelled');
    }

    function handleDispatch ({action, payload}) {
      switch (action) {
        case 'cancel':
          vm.cancel();
          break;
        case 'save':
          $uibModalInstance.close({
            listing: payload.listing,
            ucdProcesses: payload.ucdProcesses,
          });
          break;
          // no default
      }
    }
  }
})();
